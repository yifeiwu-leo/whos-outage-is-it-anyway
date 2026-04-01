import { ServiceStatus, StatusIncident, StatusSeverity } from '@/types/status';

interface CloudflareIncidentUpdate {
  body: string;
  created_at: string;
  id: string;
  incident_id: string;
  status: string;
  updated_at: string;
}

interface CloudflareIncident {
  created_at: string;
  id: string;
  impact: string;
  incident_updates: CloudflareIncidentUpdate[];
  name: string;
  page_id: string;
  resolved_at: string | null;
  shortlink: string;
  status: string;
  updated_at: string;
}

interface CloudflareResponse {
  page: { id: string; name: string; url: string; updated_at: string };
  incidents: CloudflareIncident[];
}

export interface CloudflareProviderConfig {
  id: string;
  name: string;
  url: string;
  homePageUrl?: string;
}

function mapImpactToSeverity(impact: string): StatusSeverity {
  switch (impact) {
    case 'minor': return 'minor';
    case 'major':
    case 'critical': return 'major';
    default: return 'none';
  }
}

function deriveCurrentStatus(incidents: StatusIncident[]): StatusSeverity {
  if (incidents.length === 0) return 'none';
  const severities = incidents.map((i) => i.status);
  if (severities.includes('major')) return 'major';
  if (severities.includes('minor')) return 'minor';
  if (severities.includes('maintenance')) return 'maintenance';
  return 'minor';
}

export async function fetchCloudflareStatus(config: CloudflareProviderConfig): Promise<ServiceStatus> {
  try {
    const res = await fetch(config.url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Failed to fetch status: ${res.statusText}`);

    const data: CloudflareResponse = await res.json();

    const incidents: StatusIncident[] = data.incidents.map((incident) => ({
      title: incident.name,
      description: incident.incident_updates[0]?.body ?? incident.name,
      link: incident.shortlink || data.page.url,
      pubDate: incident.updated_at,
      guid: incident.id,
      status: mapImpactToSeverity(incident.impact),
    }));

    return {
      serviceName: config.name,
      serviceUrl: config.homePageUrl ?? data.page.url,
      lastUpdated: data.page.updated_at,
      incidents,
      currentStatus: deriveCurrentStatus(incidents),
    };
  } catch (error) {
    console.error(`Error fetching Cloudflare status for ${config.name}:`, error);
    return {
      serviceName: config.name,
      serviceUrl: config.homePageUrl ?? '',
      lastUpdated: new Date().toISOString(),
      incidents: [],
      currentStatus: 'major',
    };
  }
}
