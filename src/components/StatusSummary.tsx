import { ServiceStatus } from "@/types/status";
import { CheckCircle, AlertTriangle, XCircle, Clock, LucideIcon } from "lucide-react";

interface AlertGroup {
  items: ServiceStatus[];
  Icon: LucideIcon;
  label: string;
  alertClass: string;
  iconClass: string;
  headingClass: string;
}

export function StatusSummary({ statuses }: { statuses: ServiceStatus[] }) {
  const outages     = statuses.filter(s => s.currentStatus === 'major');
  const degraded    = statuses.filter(s => s.currentStatus === 'minor');
  const maintenance = statuses.filter(s => s.currentStatus === 'maintenance');

  const groups: AlertGroup[] = [
    { items: outages,     Icon: XCircle,       label: 'Active Outages',       alertClass: 'alert-red',    iconClass: 'text-red-500',    headingClass: 'text-red-400'    },
    { items: degraded,    Icon: AlertTriangle,  label: 'Degraded Performance', alertClass: 'alert-yellow', iconClass: 'text-yellow-500', headingClass: 'text-yellow-400' },
    { items: maintenance, Icon: Clock,          label: 'Under Maintenance',    alertClass: 'alert-blue',   iconClass: 'text-blue-500',   headingClass: 'text-blue-400'   },
  ].filter(({ items }) => items.length > 0);

  if (groups.length === 0) {
    return (
      <div className="card card-success p-8 text-center mb-12">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-green-400 text-2xl mb-2">All Systems Operational</h2>
        <p className="text-green-soft">All {statuses.length} tracked services are running smoothly.</p>
      </div>
    );
  }

  return (
    <div className="card card-neutral p-6 mb-12">
      <h2 className="mb-4 border-b-neutral pb-2" style={{ color: 'white' }}>System Status Overview</h2>
      <div className="flex flex-col gap-4">
        {groups.map(({ items, Icon, label, alertClass, iconClass, headingClass }) => (
          <div key={label} className={`alert-box ${alertClass} p-4`}>
            <div className="flex items-center gap-3 mb-2">
              <Icon className={`w-5 h-5 ${iconClass}`} />
              <h3 className={headingClass}>{label}</h3>
            </div>
            <ul className="list-disc ml-2">
              {items.map(s => <li key={s.serviceName}>{s.serviceName}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
