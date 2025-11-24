import { ServiceStatus } from "@/types/status";
import { CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";

export function StatusSummary({ statuses }: { statuses: ServiceStatus[] }) {
  const impacted = statuses.filter(s => s.currentStatus !== 'none');
  const outages = impacted.filter(s => s.currentStatus === 'major');
  const degraded = impacted.filter(s => s.currentStatus === 'minor');
  const maintenance = impacted.filter(s => s.currentStatus === 'maintenance');

  if (impacted.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center mb-12 shadow-sm">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">All Systems Operational</h2>
        <p className="text-green-600">All {statuses.length} tracked services are running smoothly.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-12 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">System Status Overview</h2>
      
      <div className="space-y-4">
        {outages.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-medium text-red-900">Active Outages</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-red-800 ml-2">
              {outages.map(s => (
                <li key={s.serviceName}>{s.serviceName}</li>
              ))}
            </ul>
          </div>
        )}

        {degraded.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
             <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-medium text-yellow-900">Degraded Performance</h3>
            </div>
            <ul className="list-disc list-inside text-sm text-yellow-800 ml-2">
              {degraded.map(s => (
                <li key={s.serviceName}>{s.serviceName}</li>
              ))}
            </ul>
          </div>
        )}

        {maintenance.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">Under Maintenance</h3>
            </div>
             <ul className="list-disc list-inside text-sm text-blue-800 ml-2">
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

