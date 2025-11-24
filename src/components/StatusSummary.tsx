import { ServiceStatus } from "@/types/status";
import { CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";

export function StatusSummary({ statuses }: { statuses: ServiceStatus[] }) {
  const impacted = statuses.filter(s => s.currentStatus !== 'none');
  const outages = impacted.filter(s => s.currentStatus === 'major');
  const degraded = impacted.filter(s => s.currentStatus === 'minor');
  const maintenance = impacted.filter(s => s.currentStatus === 'maintenance');

  if (impacted.length === 0) {
    return (
      <div className="card card-success p-8 text-center mb-12">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-green-400 mb-2" style={{ fontSize: '1.5rem' }}>All Systems Operational</h2>
        <p style={{ color: 'var(--text-green-soft)' }}>All {statuses.length} tracked services are running smoothly.</p>
      </div>
    );
  }

  return (
    <div className="card card-neutral p-6 mb-12">
      <h2 className="mb-4 border-b-neutral pb-2" style={{ color: 'white' }}>System Status Overview</h2>
      
      <div className="gap-4 flex-col flex">
        {outages.length > 0 && (
          <div className="alert-box alert-red p-4">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-red-400">Active Outages</h3>
            </div>
            <ul className="list-disc ml-2">
              {outages.map(s => (
                <li key={s.serviceName}>{s.serviceName}</li>
              ))}
            </ul>
          </div>
        )}

        {degraded.length > 0 && (
          <div className="alert-box alert-yellow p-4">
             <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="text-yellow-400">Degraded Performance</h3>
            </div>
            <ul className="list-disc ml-2">
              {degraded.map(s => (
                <li key={s.serviceName}>{s.serviceName}</li>
              ))}
            </ul>
          </div>
        )}

        {maintenance.length > 0 && (
          <div className="alert-box alert-blue p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <h3 className="text-blue-400">Under Maintenance</h3>
            </div>
             <ul className="list-disc ml-2">
              {maintenance.map(s => (
                <li key={s.serviceName}>{s.serviceName}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
