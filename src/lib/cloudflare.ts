import { ServiceStatus, StatusIncident, StatusProvider, StatusSeverity } from "@/types/status";

interface CloudflareIncidentUpdate {
  body: string;
  created_at: string;
  display_at: string;
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
  monitoring_at: string | null;
  name: string;
  page_id: string;
  resolved_at: string | null;
  shortlink: string;
  status: string;
  updated_at: string;
}

interface CloudflareResponse {
  page: {
    id: string;
    name: string;
    url: string;
    updated_at: string;
  };
  incidents: CloudflareIncident[];
}

function mapCloudflareImpactToSeverity(impact: string): StatusSeverity {
  switch (impact) {
    case 'none':
      return 'none';
    case 'minor':
      return 'minor';
    case 'major':
      return 'major';
    case 'critical':
      return 'major'; // Map critical to major as we only have major/minor/none/maintenance
    default:
      return 'none';
  }
}

export async function fetchCloudflareStatus(provider: StatusProvider): Promise<ServiceStatus> {
  try {
    const res = await fetch(provider.url, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch status: ${res.statusText}`);
    }
    
    const data: CloudflareResponse = await res.json();
    
    const incidents: StatusIncident[] = data.incidents.map(incident => ({
      title: incident.name,
      description: incident.incident_updates[0]?.body || incident.name,
      link: incident.shortlink || data.page.url,
      pubDate: incident.updated_at,
      guid: incident.id,
      status: mapCloudflareImpactToSeverity(incident.impact),
    }));

    // Determine overall status based on the worst impact among unresolved incidents
    let currentStatus: StatusSeverity = 'none';
    
    if (incidents.length > 0) {
        // If there are unresolved incidents, calculate the worst status
        const severities = incidents.map(i => i.status);
        if (severities.includes('major')) {
            currentStatus = 'major';
        } else if (severities.includes('minor')) {
            currentStatus = 'minor';
        } else if (severities.includes('maintenance')) {
            // Maintenance might not be an "unresolved incident" usually, but if it appears
            currentStatus = 'maintenance'; 
        } else {
             // If we have incidents but they are all 'none' (unlikely for unresolved endpoint), default to minor to show something is up
             currentStatus = 'minor';
        }
    }

    return {
      serviceName: provider.name,
      serviceUrl: provider.homePageUrl || data.page.url,
      lastUpdated: data.page.updated_at,
      incidents: incidents,
      currentStatus: currentStatus,
    };
  } catch (error) {
    console.error(`Error fetching cloudflare status for ${provider.name}:`, error);
    return {
      serviceName: provider.name,
      serviceUrl: provider.homePageUrl || '',
      lastUpdated: new Date().toISOString(),
      incidents: [],
      currentStatus: 'major', // Fallback to error state
    };
  }
}
