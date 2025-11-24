import { ServiceStatus, StatusSeverity } from "@/types/status";
import { CheckCircle, AlertTriangle, XCircle, Clock, ExternalLink } from "lucide-react";

const SeverityIcon = ({ severity }: { severity: StatusSeverity }) => {
  switch (severity) {
    case 'none':
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    case 'minor':
      return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    case 'major':
      return <XCircle className="w-6 h-6 text-red-500" />;
    case 'maintenance':
      return <Clock className="w-6 h-6 text-blue-500" />;
  }
};

const SeverityBadge = ({ severity }: { severity: StatusSeverity }) => {
  const colors = {
    none: 'bg-green-100 text-green-800',
    minor: 'bg-yellow-100 text-yellow-800',
    major: 'bg-red-100 text-red-800',
    maintenance: 'bg-blue-100 text-blue-800',
  };

  const labels = {
    none: 'Operational',
    minor: 'Degraded Performance',
    major: 'Outage',
    maintenance: 'Maintenance',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[severity]}`}>
      {labels[severity]}
    </span>
  );
};

export function StatusCard({ service }: { service: ServiceStatus }) {
  // Filter incidents to only show those from the last 24 hours
  const recentIncidents = service.incidents.filter(incident => {
    const incidentDate = new Date(incident.pubDate);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - incidentDate.getTime()) / (1000 * 60 * 60);
    return hoursSinceUpdate < 24;
  });

  return (
    <div className="border rounded-lg shadow-sm p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <SeverityIcon severity={service.currentStatus} />
          <h2 className="text-xl font-semibold">
            <a href={service.serviceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">
              {service.serviceName}
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </h2>
        </div>
        <SeverityBadge severity={service.currentStatus} />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Recent Activity</h3>
        {recentIncidents.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No recent incidents reported.</p>
        ) : (
          <ul className="space-y-3">
            {recentIncidents.map((incident) => (
              <li key={incident.guid} className="border-l-2 border-gray-200 pl-3 py-1">
                <div className="flex justify-between items-start">
                  <a href={incident.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline text-gray-900 line-clamp-1 block">
                    {incident.title}
                  </a>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {new Date(incident.pubDate).toLocaleDateString()}
                  </span>
                </div>
                {/* We sanitize HTML or just strip tags for a preview */}
                <div 
                  className="text-xs text-gray-600 mt-1 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: incident.description }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

