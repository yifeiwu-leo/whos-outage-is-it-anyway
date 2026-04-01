import { ProviderDefinition } from '@/types/status';
import { fetchRssStatus } from './mapper';

const config = {
  id: 'gcp-imagen',
  name: 'Vertex AI Imagen',
  url: 'https://status.cloud.google.com/en/feed.atom',
  homePageUrl: 'https://status.cloud.google.com/',
  keywords: ['Imagen'],
};

export const gcpImagen: ProviderDefinition = {
  id: config.id,
  fetchStatus: () => fetchRssStatus(config),
};
