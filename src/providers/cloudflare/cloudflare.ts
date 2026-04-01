import { ProviderDefinition } from '@/types/status';
import { fetchCloudflareStatus } from './mapper';

const config = {
  id: 'cloudflare',
  name: 'Cloudflare',
  url: 'https://www.cloudflarestatus.com/api/v2/incidents/unresolved.json',
  homePageUrl: 'https://www.cloudflarestatus.com/',
};

export const cloudflare: ProviderDefinition = {
  id: config.id,
  fetchStatus: () => fetchCloudflareStatus(config),
};
