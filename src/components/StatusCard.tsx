import { ServiceStatus, StatusSeverity } from "@/types/status";
import { ChevronRight } from "lucide-react";

const StatusIndicator = ({ severity }: { severity: StatusSeverity }) => {
   const colors = {
    none: 'bg-green-500',
    minor: 'bg-yellow-500',
    major: 'bg-red-500',
    maintenance: 'bg-blue-500',
  };
  return (
    <div className={`status-indicator-bar ${colors[severity]}`} />
  );
}

export function StatusCard({ service }: { service: ServiceStatus }) {
  // Filter incidents to only show those from the last 24 hours
  const recentIncidents = service.incidents.filter(incident => {
    const incidentDate = new Date(incident.pubDate);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - incidentDate.getTime()) / (1000 * 60 * 60);
    return hoursSinceUpdate < 24;
  });

  const textColors = {
    none: 'text-green-400',
    minor: 'text-yellow-400',
    major: 'text-red-400',
    maintenance: 'text-blue-400',
  };

  return (
    <div className="status-card">
      <StatusIndicator severity={service.currentStatus} />
      
      <div className="p-6 flex-grow">
        <div className={`flex items-center justify-between ${recentIncidents.length > 0 ? 'mb-6' : ''}`}>
          <h2 className={`text-xl font-bold leading-tight ${textColors[service.currentStatus]}`}>
            {service.serviceName}
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {recentIncidents.length > 0 && (
             <div className="mt-4">
               <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                 Recent Activity (24h)
               </h3>
               <ul className="space-y-2">
                {recentIncidents.slice(0, 3).map((incident) => (
                  <li key={incident.guid} className="status-list-item">
                    <div className="flex justify-between items-start gap-2">
                      <a href={incident.link} target="_blank" rel="noopener noreferrer" className="incident-link">
                        {incident.title}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                         <span className="text-xs text-neutral-500 font-medium uppercase tracking-wide">
                           {new Date(incident.pubDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        {/* Status badge if available for incident */}
                        {incident.status && incident.status !== 'none' && (
                            <span className={`status-badge
                                ${incident.status === 'major' ? 'badge-major' : 
                                  incident.status === 'minor' ? 'badge-minor' : 
                                  incident.status === 'maintenance' ? 'badge-maintenance' : 'badge-none'}`}>
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
      </div>
      
      <div className="card-footer">
          <span>Updated {new Date(service.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          <a href={service.serviceUrl} target="_blank" rel="noopener noreferrer" className="history-link">
              History <ChevronRight className="w-3 h-3 ml-2" />
          </a>
      </div>
    </div>
  );
}
