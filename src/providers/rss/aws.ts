import { ProviderDefinition } from '@/types/status';
import { fetchRssStatus } from './mapper';

const config = {
  id: 'aws',
  name: 'AWS US-EAST-1 (select services)',
  url: 'https://status.aws.amazon.com/rss/all.rss',
  homePageUrl: 'https://health.aws.amazon.com/health/status',
  keywords: [
    'Amazon Route 53',
    'Amazon ECS',
    'Amazon EC2',
    'Amazon S3',
    'Amazon RDS',
    'AWS Lambda',
    'Amazon CloudFront',
    'Amazon EKS',
    'Amazon DynamoDB',
    'AWS IAM',
  ],
  minSeverity: 'minor' as const,
};

export const aws: ProviderDefinition = {
  id: config.id,
  fetchStatus: () => fetchRssStatus(config),
};
