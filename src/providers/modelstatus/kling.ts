import { ProviderDefinition } from '@/types/status';
import { fetchModelStatus } from './mapper';

const config = {
  id: 'kling',
  name: 'Kling',
  apiBaseUrl: 'https://modelstatus.ai',
  apiProviderId: 'kling',
  homePageUrl: 'https://www.modelstatus.ai/',
};

export const kling: ProviderDefinition = {
  id: config.id,
  fetchStatus: () => fetchModelStatus(config),
};
