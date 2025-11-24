import Parser from 'rss-parser';
import { ServiceStatus, StatusIncident, StatusProvider, StatusSeverity } from '@/types/status';

// Custom interface for the RSS item to include content snippet if needed
interface CustomItem extends Parser.Item {
  contentSnippet?: string;
}

interface CustomFeed {
  lastBuildDate?: string;
}

const parser = new Parser<CustomFeed, CustomItem>();

function determineSeverity(text: string): StatusSeverity {
  const lowerText = text.toLowerCase();
  
  // Check for maintenance first
  if (lowerText.includes('maintenance') || lowerText.includes('scheduled')) {
    return 'maintenance';
  }
  
  // Check for major issues
  if (lowerText.includes('major') || lowerText.includes('outage') || lowerText.includes('critical')) {
    return 'major';
  }
  
  // Check for minor issues/investigating
  if (
    lowerText.includes('investigating') || 
    lowerText.includes('monitoring') || 
    lowerText.includes('identified') || 
    lowerText.includes('latency') ||
    lowerText.includes('degraded')
  ) {
    return 'minor';
  }

  // Default to none (operational) if it says resolved or if we can't find negative keywords
  if (lowerText.includes('resolved') || lowerText.includes('operational')) {
    return 'none';
  }

  return 'none';
}

export async function fetchServiceStatus(provider: StatusProvider): Promise<ServiceStatus> {
  try {
    const feed = await parser.parseURL(provider.url);
    
    const incidents: StatusIncident[] = feed.items.map((item) => {
      // Simple severity extraction from title and start of description
      const contentToCheck = `${item.title} ${item.contentSnippet || item.content || ''}`;
      const status = determineSeverity(contentToCheck);
      
      return {
        title: item.title || 'Unknown Incident',
        description: item.contentSnippet || item.content || '',
        link: item.link || '',
        pubDate: item.pubDate || new Date().toISOString(),
        guid: item.guid || item.link || Math.random().toString(),
        status,
      };
    });

    let currentStatus: StatusSeverity = 'none';
    
    if (incidents.length > 0) {
      const latestIncident = incidents[0];
      const desc = latestIncident.description;
      
      // Try to find status from the structured description (HTML)
      // Look for the FIRST occurrence of status keywords in bold/strong tags
      // This assumes the latest update is at the top
      const statusMatch = desc.match(/<strong>(Resolved|Monitoring|Investigating|Identified|Completed|Scheduled|In progress)<\/strong>/i);
         
      if (statusMatch) {
        const statusText = statusMatch[1].toLowerCase();
        if (statusText === 'resolved' || statusText === 'completed') {
          currentStatus = 'none';
        } else if (statusText === 'monitoring' || statusText === 'investigating' || statusText === 'identified' || statusText === 'in progress') {
          currentStatus = 'minor';
        } else if (statusText === 'scheduled') {
          currentStatus = 'maintenance';
        }
      } else {
        // Fallback: Use the status calculated for the incident
        // But if the incident status is 'minor'/'major' because of history, this might be wrong.
        // If the title says "Resolved", trust the title.
        if (latestIncident.title.toLowerCase().includes('resolved')) {
          currentStatus = 'none';
        } else {
          currentStatus = latestIncident.status || 'none';
        }
      }
    }

    return {
      serviceName: provider.name,
      serviceUrl: provider.homePageUrl || new URL(provider.url).origin,
      lastUpdated: feed.lastBuildDate || new Date().toISOString(),
      incidents,
      currentStatus,
    };
  } catch (error) {
    console.error(`Error fetching status for ${provider.name}:`, error);
    return {
      serviceName: provider.name,
      serviceUrl: provider.url,
      lastUpdated: new Date().toISOString(),
      incidents: [],
      currentStatus: 'major', // Fail safe to red? Or gray? 'none' might be misleading.
    };
  }
}
