export type StatusSeverity = 'none' | 'minor' | 'major' | 'maintenance';

export interface StatusIncident {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
  status?: StatusSeverity; // Derived from description or title if possible
}

export interface ServiceStatus {
  serviceName: string;
  serviceUrl: string;
  lastUpdated: string;
  incidents: StatusIncident[];
  currentStatus: StatusSeverity; // Overall status
}

export interface StatusProvider {
  id: string;
  name: string;
  url: string; // The RSS feed URL
  homePageUrl?: string;
}

