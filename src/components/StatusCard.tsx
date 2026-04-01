import { ServiceStatus, StatusSeverity } from "@/types/status";
import { ChevronRight } from "lucide-react";

const statusColors: Record<StatusSeverity, string> = {
  none: 'bg-green-500',
  minor: 'bg-yellow-500',
  major: 'bg-red-500',
  maintenance: 'bg-blue-500',
};

const statusTextColors: Record<StatusSeverity, string> = {
  none: 'text-green-400',
  minor: 'text-yellow-400',
  major: 'text-red-400',
  maintenance: 'text-blue-400',
};

const badgeClass: Record<string, string> = {
  major: 'badge-major',
  minor: 'badge-minor',
  maintenance: 'badge-maintenance',
};

function timeAgo(dateStr: string): string {
  const minutes = (Date.now() - new Date(dateStr).getTime()) / 60000;
  if (minutes < 60) return `${Math.round(minutes)}m ago`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function StatusCard({ service }: { service: ServiceStatus }) {
  const recentIncidents = service.incidents.filter(({ pubDate }) => {
    const hoursSince = (Date.now() - new Date(pubDate).getTime()) / 36e5;
    return hoursSince < 24;
  });

  return (
    <div className="status-card">
      <div className={`status-indicator-bar ${statusColors[service.currentStatus]}`} />

      <div className="p-6 flex-grow">
        <h2 className={`text-xl font-bold leading-tight ${statusTextColors[service.currentStatus]} ${recentIncidents.length > 0 ? 'mb-6' : ''}`}>
          {service.serviceName}
        </h2>

        {recentIncidents.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Recent Activity (24h)
            </h3>
            <ul className="space-y-2">
              {recentIncidents.slice(0, 3).map((incident) => (
                <li key={incident.guid} className="status-list-item">
                  <a href={incident.link} target="_blank" rel="noopener noreferrer" className="incident-link">
                    {incident.title}
                  </a>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-neutral-500 font-medium uppercase tracking-wide">
                      {timeAgo(incident.pubDate)}
                    </span>
                    {incident.status && incident.status !== 'none' && (
                      <span className={`status-badge ${badgeClass[incident.status] ?? 'badge-none'}`}>
                        {incident.status}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card-footer">
        <span>Updated {timeAgo(service.lastUpdated)}</span>
        <a href={service.serviceUrl} target="_blank" rel="noopener noreferrer" className="history-link">
          History <ChevronRight className="w-3 h-3 ml-2" />
        </a>
      </div>
    </div>
  );
}
