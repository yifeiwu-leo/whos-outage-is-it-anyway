import { PROVIDERS } from "@/lib/providers";
import { fetchServiceStatus } from "@/lib/status-fetcher";
import { StatusCard } from "@/components/StatusCard";
import { AutoRefresh } from "@/components/AutoRefresh";
import { StatusSummary } from "@/components/StatusSummary";
import { ServiceStatus } from "@/types/status";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const statuses = await Promise.all(
    PROVIDERS.map((provider) => fetchServiceStatus(provider))
  );

  const sortedStatuses = statuses.sort((a, b) => {
    // Helper to check if a service has recent incidents (last 24h)
    const hasRecentIncidents = (service: ServiceStatus) => {
      if (service.incidents.length === 0) return false;
      const now = new Date();
      return service.incidents.some(incident => {
        const incidentDate = new Date(incident.pubDate);
        const hoursSinceUpdate = (now.getTime() - incidentDate.getTime()) / (1000 * 60 * 60);
        return hoursSinceUpdate < 24;
      });
    };

    const aActive = a.currentStatus !== 'none';
    const bActive = b.currentStatus !== 'none';

    // 1. Active incidents (not 'none') come first
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;

    // If both are active or both are inactive, check for recent history
    if (aActive === bActive) {
        const aRecent = hasRecentIncidents(a);
        const bRecent = hasRecentIncidents(b);

        // 2. Services with recent incidents come next
        if (aRecent && !bRecent) return -1;
        if (!aRecent && bRecent) return 1;
    }

    // 3. Alphabetical order as fallback
    return a.serviceName.localeCompare(b.serviceName);
  });


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
