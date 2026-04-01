import { aws } from './rss/aws';
import { bfl } from './rss/bfl';
import { fal } from './rss/fal';
import { gcpVeo } from './rss/gcp-veo';
import { gcpGemini } from './rss/gcp-gemini';
import { gcpImagen } from './rss/gcp-imagen';
import { openai } from './rss/openai';
import { hasura } from './rss/hasura';
import { kling } from './modelstatus/kling';
import { minimax } from './modelstatus/minimax';
import { bytedance } from './modelstatus/bytedance';
import { cloudflare } from './cloudflare/cloudflare';

export const PROVIDERS = [
  aws,
  bfl,
  fal,
  gcpVeo,
  gcpGemini,
  gcpImagen,
  openai,
  kling,
  minimax,
  bytedance,
  cloudflare,
  hasura,
];
