import { PROVIDERS } from "@/providers";
import { StatusCard } from "@/components/StatusCard";
import { AutoRefresh } from "@/components/AutoRefresh";
import { StatusSummary } from "@/components/StatusSummary";
import { ServiceStatus } from "@/types/status";

export const revalidate = 60;

function sortStatuses(statuses: ServiceStatus[]): ServiceStatus[] {
  const now = Date.now();
  const hasRecentIncident = (s: ServiceStatus) =>
    s.incidents.some(i => (now - new Date(i.pubDate).getTime()) / 36e5 < 24);

  return [...statuses].sort((a, b) => {
    const aActive = a.currentStatus !== 'none';
    const bActive = b.currentStatus !== 'none';
    if (aActive !== bActive) return aActive ? -1 : 1;

    const aRecent = hasRecentIncident(a);
    const bRecent = hasRecentIncident(b);
    if (aRecent !== bRecent) return aRecent ? -1 : 1;

    return a.serviceName.localeCompare(b.serviceName);
  });
}

export default async function Home() {
  const statuses = await Promise.all(
    PROVIDERS.map((provider) => provider.fetchStatus())
  );

  const sortedStatuses = sortStatuses(statuses);


  return (
    <main className="py-12">
      <AutoRefresh intervalMs={60000} />
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="mb-2">
            Who&apos;s Outage Is It Anyway?
          </h1>
          <p className="text-lg text-neutral-400">
            3rd Party Providers Status Dashboard
          </p>
        </div>

        <StatusSummary statuses={statuses} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedStatuses.map((status) => (
            <StatusCard key={status.serviceName} service={status} />
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-neutral-500">
          <p>
            Auto-refreshes every 60 seconds. Data sourced from public status pages.
          </p>
        </div>
      </div>
    </main>
  );
}
