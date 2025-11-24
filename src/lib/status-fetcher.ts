import { fetchModelStatus } from "./modelstatus";
import { fetchServiceStatus as fetchRssStatus } from "./rss";
import { fetchCloudflareStatus } from "./cloudflare";
import { ServiceStatus, StatusProvider } from "@/types/status";

export async function fetchServiceStatus(provider: StatusProvider): Promise<ServiceStatus> {
  if (provider.type === 'modelstatus_api') {
    return fetchModelStatus(provider);
  }
  if (provider.type === 'cloudflare_api') {
    return fetchCloudflareStatus(provider);
  }
  return fetchRssStatus(provider);
}

