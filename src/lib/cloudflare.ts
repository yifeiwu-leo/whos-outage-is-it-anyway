import { ServiceStatus, StatusIncident, StatusProvider, StatusSeverity } from "@/types/status";

interface CloudflareComponent {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  position: number;
  description: string | null;
  showcase: boolean;
  start_date: string | null;
  group_id: string | null;
  page_id: string;
  group: boolean;
  only_show_if_degraded: boolean;
}

interface CloudflareResponse {
  page: {
    id: string;
    name: string;
    url: string;
    time_zone: string;
    updated_at: string;
  };
  components: CloudflareComponent[];
}

function mapCloudflareStatusToSeverity(status: string): StatusSeverity {
  switch (status) {
    case 'operational':
      return 'none';
    case 'degraded_performance':
      return 'minor';
    case 'partial_outage':
      return 'major';
    case 'major_outage':
      return 'major';
    case 'maintenance':
      return 'maintenance';
    default:
      return 'none';
  }
}

function formatStatusName(status: string): string {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function fetchCloudflareStatus(provider: StatusProvider): Promise<ServiceStatus> {
  try {
    if (!provider.componentId) {
      throw new Error('Component ID is required for Cloudflare API provider');
    }

    const res = await fetch(provider.url, { next: { revalidate: 60 } });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch status: ${res.statusText}`);
    }
    
    const data: CloudflareResponse = await res.json();
    
    const component = data.components.find(c => c.id === provider.componentId);
    
    if (!component) {
      throw new Error(`Component with ID ${provider.componentId} not found`);
    }

    const currentStatus = mapCloudflareStatusToSeverity(component.status);
    const incidents: StatusIncident[] = [];

    // If there is an active issue (not operational), create an incident from the component state
    if (currentStatus !== 'none') {
      incidents.push({
        title: formatStatusName(component.status),
        description: component.description || `Current status: ${formatStatusName(component.status)}`,
        link: provider.homePageUrl || data.page.url,
        pubDate: component.updated_at, // User requested to use updated_at
        guid: `${component.id}-${component.updated_at}`,
        status: currentStatus,
      });
    }

    return {
      serviceName: provider.name,
      serviceUrl: provider.homePageUrl || data.page.url,
      lastUpdated: component.updated_at || data.page.updated_at,
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
