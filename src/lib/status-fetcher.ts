import { fetchModelStatus } from "./modelstatus";
import { fetchServiceStatus as fetchRssStatus } from "./rss";
import { ServiceStatus, StatusProvider } from "@/types/status";

export async function fetchServiceStatus(provider: StatusProvider): Promise<ServiceStatus> {
  if (provider.type === 'modelstatus_api') {
    return fetchModelStatus(provider);
  }
  return fetchRssStatus(provider);
}

