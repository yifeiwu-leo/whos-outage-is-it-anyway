import Parser from 'rss-parser';
import { ServiceStatus, StatusIncident, StatusSeverity } from '@/types/status';

interface CustomItem extends Parser.Item {
  contentSnippet?: string;
}

interface CustomFeed {
  lastBuildDate?: string;
}

const parser = new Parser<CustomFeed, CustomItem>();

const severityRank: Record<StatusSeverity, number> = {
  none: 0,
  maintenance: 1,
  minor: 2,
  major: 3,
};

export interface RssProviderConfig {
  id: string;
  name: string;
  url: string;
  homePageUrl?: string;
  keywords?: string[];
  /** Only include incidents at or above this severity. Defaults to 'none' (all). */
  minSeverity?: StatusSeverity;
}

function determineSeverity(text: string): StatusSeverity {
  const t = text.toLowerCase();
  if (t.includes('maintenance') || t.includes('scheduled')) return 'maintenance';
  if (t.includes('major') || t.includes('outage') || t.includes('critical')) return 'major';
  if (t.includes('investigating') || t.includes('monitoring') || t.includes('identified') || t.includes('latency') || t.includes('degraded')) return 'minor';
  if (t.includes('resolved') || t.includes('operational')) return 'none';
  return 'none';
}

function deriveCurrentStatus(incidents: StatusIncident[]): StatusSeverity {
  if (incidents.length === 0) return 'none';

  const latest = incidents[0];
  const hoursSince = (Date.now() - new Date(latest.pubDate).getTime()) / 36e5;
  if (hoursSince >= 24) return 'none';

  const statusMatch = latest.description.match(
    /<strong>(Resolved|Monitoring|Investigating|Identified|Completed|Scheduled|In progress)<\/strong>/i
  );

  if (statusMatch) {
    const s = statusMatch[1].toLowerCase();
    if (s === 'resolved' || s === 'completed') return 'none';
    if (s === 'monitoring' || s === 'investigating' || s === 'identified' || s === 'in progress') return 'minor';
    if (s === 'scheduled') return 'maintenance';
  }

  if (latest.title.toLowerCase().includes('resolved')) return 'none';
  return latest.status ?? 'none';
}

export async function fetchRssStatus(config: RssProviderConfig): Promise<ServiceStatus> {
  try {
    const feed = await parser.parseURL(config.url);

    const allIncidents: StatusIncident[] = feed.items.map((item) => ({
      title: item.title || 'Unknown Incident',
      description: item.contentSnippet || item.content || '',
      link: item.link || '',
      pubDate: item.pubDate || new Date().toISOString(),
      guid: item.guid || item.link || crypto.randomUUID(),
      status: determineSeverity(`${item.title} ${item.contentSnippet || item.content || ''}`),
    }));

    const minRank = severityRank[config.minSeverity ?? 'none'];

    const incidents = allIncidents.filter(({ title, description, status }) => {
      if (config.keywords?.length) {
        const text = `${title} ${description}`.toLowerCase();
        if (!config.keywords.some((kw) => text.includes(kw.toLowerCase()))) return false;
      }
      return severityRank[status ?? 'none'] >= minRank;
    });

    return {
      serviceName: config.name,
      serviceUrl: config.homePageUrl ?? new URL(config.url).origin,
      lastUpdated: feed.lastBuildDate || new Date().toISOString(),
      incidents,
      currentStatus: deriveCurrentStatus(incidents),
    };
  } catch (error) {
    console.error(`Error fetching RSS status for ${config.name}:`, error);
    return {
      serviceName: config.name,
      serviceUrl: config.homePageUrl ?? config.url,
      lastUpdated: new Date().toISOString(),
      incidents: [],
      currentStatus: 'major',
    };
  }
}
