import { ProviderDefinition } from '@/types/status';
import { fetchModelStatus } from './mapper';

const config = {
  id: 'bytedance',
  name: 'ByteDance',
  apiBaseUrl: 'https://modelstatus.ai',
  apiProviderId: 'bytedance',
  homePageUrl: 'https://www.modelstatus.ai/',
};

export const bytedance: ProviderDefinition = {
  id: config.id,
  fetchStatus: () => fetchModelStatus(config),
};
