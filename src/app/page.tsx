import { PROVIDERS } from "@/lib/providers";
import { fetchServiceStatus } from "@/lib/status-fetcher";
import { StatusCard } from "@/components/StatusCard";
import { AutoRefresh } from "@/components/AutoRefresh";
import { StatusSummary } from "@/components/StatusSummary";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const statuses = await Promise.all(
    PROVIDERS.map((provider) => fetchServiceStatus(provider))
  );

  return (
    <main className="py-12">
      <AutoRefresh intervalMs={60000} />
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="mb-2">
            Who&apos;s Outage Is It Anyway?
          </h1>
          <p className="text-lg text-neutral-400">
            Operational status dashboard 3rd Party Providers
          </p>
        </div>

        <StatusSummary statuses={statuses} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statuses.map((status) => (
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
