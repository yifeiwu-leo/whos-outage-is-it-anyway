import { PROVIDERS } from "@/lib/providers";
import { fetchServiceStatus } from "@/lib/rss";
import { StatusCard } from "@/components/StatusCard";
import { AutoRefresh } from "@/components/AutoRefresh";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const statuses = await Promise.all(
    PROVIDERS.map((provider) => fetchServiceStatus(provider))
  );

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AutoRefresh intervalMs={60000} />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Who&apos;s Outage Is It Anyway?
          </h1>
          <p className="text-lg text-gray-600">
            Operational status dashboard for our dependencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statuses.map((status) => (
            <StatusCard key={status.serviceName} service={status} />
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Auto-refreshes every 60 seconds. Data sourced from public status pages.
          </p>
        </div>
      </div>
    </main>
  );
}
