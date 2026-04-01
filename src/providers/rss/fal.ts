import { ProviderDefinition } from '@/types/status';
import { fetchRssStatus } from './mapper';

const config = {
  id: 'fal',
  name: 'Fal.ai',
  url: 'https://status.fal.ai/history.rss',
  homePageUrl: 'https://status.fal.ai',
};

export const fal: ProviderDefinition = {
  id: config.id,
  fetchStatus: () => fetchRssStatus(config),
};
