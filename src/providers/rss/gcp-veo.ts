import { ProviderDefinition } from '@/types/status';
import { fetchRssStatus } from './mapper';

const config = {
  id: 'gcp-veo',
  name: 'Vertex AI Veo',
  url: 'https://status.cloud.google.com/en/feed.atom',
  homePageUrl: 'https://status.cloud.google.com/',
  keywords: ['Veo'],
};

export const gcpVeo: ProviderDefinition = {
  id: config.id,
  fetchStatus: () => fetchRssStatus(config),
};
