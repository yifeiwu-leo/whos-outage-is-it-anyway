import { ProviderDefinition } from '@/types/status';
import { fetchRssStatus } from './mapper';

const config = {
  id: 'gcp-gemini',
  name: 'Vertex AI Gemini',
  url: 'https://status.cloud.google.com/en/feed.atom',
  homePageUrl: 'https://status.cloud.google.com/',
  keywords: ['Gemini', 'Vertex AI'],
};

export const gcpGemini: ProviderDefinition = {
  id: config.id,
  fetchStatus: () => fetchRssStatus(config),
};
