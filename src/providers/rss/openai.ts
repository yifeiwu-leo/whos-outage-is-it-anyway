import { ProviderDefinition } from '@/types/status';
import { fetchRssStatus } from './mapper';

const config = {
  id: 'openai',
  name: 'OpenAI',
  url: 'https://status.openai.com/feed.rss',
  homePageUrl: 'https://status.openai.com/',
};

export const openai: ProviderDefinition = {
  id: config.id,
  fetchStatus: () => fetchRssStatus(config),
};
