# Who's Outage Is It Anyway?

A real-time status dashboard for third-party AI and infrastructure providers. Aggregates public status pages and APIs into a single view, auto-refreshing every 60 seconds.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Adding a New Provider

Providers live under `src/providers/`, organised by their source type. Each provider is a small file that defines its config and delegates fetching to its mapper.

### RSS feed provider

Most status pages expose an RSS or Atom feed. Create a file under `src/providers/rss/`:

```ts
// src/providers/rss/acme.ts
import { ProviderDefinition } from '@/types/status';
import { fetchRssStatus } from './mapper';

const config = {
  id: 'acme',
  name: 'Acme',
  url: 'https://status.acme.com/feed.rss',
  homePageUrl: 'https://status.acme.com/',
  // keywords: ['Specific Component'],  // optional — filters incidents by keyword
};

export const acme: ProviderDefinition = {
  id: config.id,
  fetchStatus: () => fetchRssStatus(config),
};
```

### ModelStatus API provider

For providers tracked by [modelstatus.ai](https://modelstatus.ai), create a file under `src/providers/modelstatus/`:

```ts
// src/providers/modelstatus/acme.ts
import { ProviderDefinition } from '@/types/status';
import { fetchModelStatus } from './mapper';

const config = {
  id: 'acme',
  name: 'Acme',
  apiBaseUrl: 'https://modelstatus.ai',
  apiProviderId: 'acme',           // the provider slug on modelstatus.ai
  homePageUrl: 'https://acme.com/',
};

export const acme: ProviderDefinition = {
  id: config.id,
  fetchStatus: () => fetchModelStatus(config),
};
```

### Custom API provider

For providers with their own API (e.g. a Cloudflare-style JSON endpoint), create a mapper under a new subfolder and follow the same pattern — the mapper handles fetching and maps the response to `ServiceStatus`, and the provider file wires it up.

### Registering the provider

After creating the file, add it to `src/providers/index.ts`:

```ts
import { acme } from './rss/acme';   // or modelstatus/acme, etc.

export const PROVIDERS = [
  // ...existing providers...
  acme,
];
```

That's it — the dashboard picks it up automatically.

## Project Structure

```
src/
  providers/
    index.ts              # all providers registered here
    rss/
      mapper.ts           # shared RSS fetch + severity logic
      bfl.ts, fal.ts ...  # one file per provider
    modelstatus/
      mapper.ts           # ModelStatus API fetch + mapping
      kling.ts, ...
    cloudflare/
      mapper.ts           # Cloudflare API fetch + mapping
      cloudflare.ts
  components/
    StatusCard.tsx
    StatusSummary.tsx
    AutoRefresh.tsx
  types/
    status.ts             # ServiceStatus, StatusIncident, ProviderDefinition
  app/
    page.tsx
```
