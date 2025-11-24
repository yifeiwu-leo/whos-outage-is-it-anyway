export type StatusSeverity = 'none' | 'minor' | 'major' | 'maintenance';
export type ProviderType = 'rss' | 'modelstatus_api' | 'cloudflare_api';

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
  url: string; // The RSS feed URL or API base URL
  type?: ProviderType; // Defaults to 'rss' if undefined
  apiProviderId?: string; // For modelstatus_api, the provider slug (e.g., 'kling')
  homePageUrl?: string;
  keywords?: string[]; // Optional keywords to filter incidents
  componentId?: string; // For cloudflare_api to identify specific component
}
