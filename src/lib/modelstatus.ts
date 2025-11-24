import { ServiceStatus, StatusIncident, StatusProvider, StatusSeverity } from '@/types/status';

interface ModelStatusResponse {
  state: string;
  result: {
    provider_username: string;
    provider_name: string;
    status: 'operational' | 'degraded' | 'down' | 'insufficient_data';
    error_rate: number;
    average_generation_time: number;
    timestamp: string;
  };
}

interface ModelStatusIncidentsResponse {
  state: string;
  result: {
    incidents: Array<{
      incident_id: string;
      title: string;
      status: string;
      severity: string;
      detected_at: string;
    }>;
    total: number;
  };
}

function mapModelStatusToSeverity(status: string): StatusSeverity {
  switch (status) {
    case 'operational':
      return 'none';
    case 'degraded':
      return 'minor';
    case 'down':
      return 'major';
    case 'insufficient_data':
    default:
      return 'none'; // Or maybe minor?
  }
}

export async function fetchModelStatus(provider: StatusProvider): Promise<ServiceStatus> {
  try {
    // Fetch current status
    const statusUrl = `${provider.url}/api/provider/${provider.apiProviderId}/status`;
    const statusRes = await fetch(statusUrl, { next: { revalidate: 60 } });
    
    if (!statusRes.ok) {
      throw new Error(`Failed to fetch status: ${statusRes.statusText}`);
    }
    
    const statusData: ModelStatusResponse = await statusRes.json();
    
    // Fetch incidents
    const incidentsUrl = `${provider.url}/api/incidents?provider=${provider.apiProviderId}`;
    const incidentsRes = await fetch(incidentsUrl, { next: { revalidate: 60 } });
    
    let incidents: StatusIncident[] = [];
    
    if (incidentsRes.ok) {
      const incidentsData: ModelStatusIncidentsResponse = await incidentsRes.json();
      incidents = incidentsData.result.incidents.map(inc => ({
        title: inc.title,
        description: `Status: ${inc.status}, Severity: ${inc.severity}`,
        link: provider.homePageUrl || 'https://www.modelstatus.ai/', // Use homepage URL for incidents too as specific links might not work
        pubDate: inc.detected_at,
        guid: inc.incident_id,
        status: inc.severity === 'critical' ? 'major' : 'minor', // Simple mapping
      }));
    }

    return {
      serviceName: provider.name,
      serviceUrl: provider.homePageUrl || `https://modelstatus.ai/provider/${provider.apiProviderId}`,
      lastUpdated: statusData.result.timestamp,
      incidents: incidents,
      currentStatus: mapModelStatusToSeverity(statusData.result.status),
    };
  } catch (error) {
    console.error(`Error fetching model status for ${provider.name}:`, error);
    return {
      serviceName: provider.name,
      serviceUrl: provider.homePageUrl || '',
      lastUpdated: new Date().toISOString(),
      incidents: [],
      currentStatus: 'major', // Fallback to error state
    };
  }
}
