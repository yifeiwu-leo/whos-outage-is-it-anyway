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
    <div className={`h-1 w-full ${colors[severity]} absolute top-0 left-0 right-0 rounded-t-lg`} />
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
    none: 'text-green-600',
    minor: 'text-yellow-600',
    major: 'text-red-600',
    maintenance: 'text-blue-600',
  };

  return (
    <div className="group relative border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition-colors duration-200 overflow-hidden flex flex-col">
      <StatusIndicator severity={service.currentStatus} />
      
      <div className="p-6 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold leading-tight ${textColors[service.currentStatus]}`}>
            {service.serviceName}
          </h2>
        </div>

        <div className="space-y-4">
          {recentIncidents.length > 0 && (
             <div className="mt-4">
               <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                 Recent Activity (24h)
               </h3>
               <ul className="space-y-2">
                {recentIncidents.slice(0, 3).map((incident) => (
                  <li key={incident.guid} className="relative pb-3 border-b border-gray-100 last:border-0 last:pb-0 transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <a href={incident.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
                        {incident.title}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                           {new Date(incident.pubDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        {/* Status badge if available for incident */}
                        {incident.status && incident.status !== 'none' && (
                            <span className={`text-[10px] px-1.5 rounded-full capitalize
                                ${incident.status === 'major' ? 'bg-red-100 text-red-700' : 
                                  incident.status === 'minor' ? 'bg-yellow-100 text-yellow-700' : 
                                  incident.status === 'maintenance' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                {incident.status}
                            </span>
                        )}
                    </div>
                  </li>
                ))}
               </ul>
             </div>
          )}
          
          {recentIncidents.length === 0 && (
              <div className="h-full flex items-center justify-center min-h-[80px] text-sm text-gray-400 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                  No incidents in last 24h
              </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span>Updated {new Date(service.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          <a href={service.serviceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-gray-900 transition-colors font-medium">
              History <ChevronRight className="w-3 h-3 ml-0.5" />
          </a>
      </div>
    </div>
  );
}
