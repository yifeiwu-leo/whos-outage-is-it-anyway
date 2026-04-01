import { ProviderDefinition } from '@/types/status';
import { fetchRssStatus } from './mapper';

const config = {
  id: 'hasura',
  name: 'Hasura',
  url: 'https://hasura-status.com/feed.rss',
  homePageUrl: 'https://hasura-status.com/',
};

export const hasura: ProviderDefinition = {
  id: config.id,
  fetchStatus: () => fetchRssStatus(config),
};
