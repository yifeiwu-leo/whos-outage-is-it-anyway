export type StatusSeverity = 'none' | 'minor' | 'major' | 'maintenance';

export interface StatusIncident {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
  status?: StatusSeverity;
}

export interface ServiceStatus {
  serviceName: string;
  serviceUrl: string;
  lastUpdated: string;
  incidents: StatusIncident[];
  currentStatus: StatusSeverity;
}

export interface ProviderDefinition {
  id: string;
  fetchStatus: () => Promise<ServiceStatus>;
}
