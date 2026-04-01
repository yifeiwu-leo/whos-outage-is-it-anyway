import { ProviderDefinition } from '@/types/status';
import { fetchModelStatus } from './mapper';

const config = {
  id: 'minimax',
  name: 'Minimax',
  apiBaseUrl: 'https://modelstatus.ai',
  apiProviderId: 'minimax',
  homePageUrl: 'https://www.modelstatus.ai/',
};

export const minimax: ProviderDefinition = {
  id: config.id,
  fetchStatus: () => fetchModelStatus(config),
};
