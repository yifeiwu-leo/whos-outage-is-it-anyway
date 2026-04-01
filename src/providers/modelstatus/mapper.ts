import { ServiceStatus, StatusIncident, StatusSeverity } from '@/types/status';

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

export interface ModelStatusProviderConfig {
  id: string;
  name: string;
  apiBaseUrl: string;
  apiProviderId: string;
  homePageUrl?: string;
}

function mapStatusToSeverity(status: string): StatusSeverity {
  switch (status) {
    case 'operational': return 'none';
    case 'degraded': return 'minor';
    case 'down': return 'major';
    default: return 'none';
  }
}

function mapSeverityToIncidentStatus(severity: string): StatusSeverity {
  return severity === 'critical' ? 'major' : 'minor';
}

export async function fetchModelStatus(config: ModelStatusProviderConfig): Promise<ServiceStatus> {
  try {
    const [statusRes, incidentsRes] = await Promise.all([
      fetch(`${config.apiBaseUrl}/api/provider/${config.apiProviderId}/status`, { next: { revalidate: 60 } }),
      fetch(`${config.apiBaseUrl}/api/incidents?provider=${config.apiProviderId}`, { next: { revalidate: 60 } }),
    ]);

    if (!statusRes.ok) throw new Error(`Failed to fetch status: ${statusRes.statusText}`);

    const statusData: ModelStatusResponse = await statusRes.json();

    let incidents: StatusIncident[] = [];
    if (incidentsRes.ok) {
      const incidentsData: ModelStatusIncidentsResponse = await incidentsRes.json();
      incidents = incidentsData.result.incidents.map((inc) => ({
        title: inc.title,
        description: `Status: ${inc.status}, Severity: ${inc.severity}`,
        link: config.homePageUrl ?? 'https://www.modelstatus.ai/',
        pubDate: inc.detected_at,
        guid: inc.incident_id,
        status: mapSeverityToIncidentStatus(inc.severity),
      }));
    }

    return {
      serviceName: config.name,
      serviceUrl: config.homePageUrl ?? `https://modelstatus.ai/provider/${config.apiProviderId}`,
      lastUpdated: statusData.result.timestamp,
      incidents,
      currentStatus: mapStatusToSeverity(statusData.result.status),
    };
  } catch (error) {
    console.error(`Error fetching model status for ${config.name}:`, error);
    return {
      serviceName: config.name,
      serviceUrl: config.homePageUrl ?? '',
      lastUpdated: new Date().toISOString(),
      incidents: [],
      currentStatus: 'major',
    };
  }
}
