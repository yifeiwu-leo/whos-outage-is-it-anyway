import { ProviderDefinition } from '@/types/status';
import { fetchRssStatus } from './mapper';

const config = {
  id: 'bfl',
  name: 'Black Forest Labs',
  url: 'https://status.bfl.ml/history.rss',
  homePageUrl: 'https://status.bfl.ml',
};

export const bfl: ProviderDefinition = {
  id: config.id,
  fetchStatus: () => fetchRssStatus(config),
};
