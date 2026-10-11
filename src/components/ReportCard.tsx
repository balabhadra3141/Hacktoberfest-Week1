import type { Report } from '../types';
import { CATEGORY_CONFIG, SEVERITY_CONFIG, STATUS_CONFIG } from '../lib/constants';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, ChevronRight } from 'lucide-react';

interface ReportCardProps {
  report: Report;
  onClick: () => void;
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  const cat = CATEGORY_CONFIG[report.analysis.category];
  const sev = SEVERITY_CONFIG[report.analysis.severity];
  const st = STATUS_CONFIG[report.status];

  return (
    <button
      onClick={onClick}
      className="w-full text-left group bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md hover:border-forest-300 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
    >
      <div className="flex gap-3 p-4">
        {/* Image thumbnail or category icon */}
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl border ${cat.bgColor}`}>
          {report.imageDataUrl ? (
            <img
              src={report.imageDataUrl}
              alt="Issue thumbnail"
              className="w-14 h-14 rounded-xl object-cover"
            />
          ) : (
            <span>{cat.emoji}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap gap-1.5 mb-1">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${st.color}`}>
                {st.icon} {st.label}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${sev.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sev.dotColor}`} />
                {sev.label}
              </span>
            </div>
            <ChevronRight className="flex-shrink-0 text-stone-400 group-hover:text-forest-600 w-4 h-4 mt-0.5 transition-colors" />
          </div>

          <p className="text-sm font-medium text-stone-800 line-clamp-2 leading-snug">
            {report.analysis.shortDescription}
          </p>

          <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
            {report.location && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {report.location}
              </span>
            )}
            <span className="flex-shrink-0">
              {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
            </span>
          </div>

          {report.isSampleData && (
            <span className="mt-1.5 inline-block text-xs text-stone-400 italic">Sample data</span>
          )}
        </div>
      </div>

      {/* Category stripe */}
      <div className={`h-1 w-full ${cat.bgColor.includes('amber') ? 'bg-amber-400' : cat.bgColor.includes('orange') ? 'bg-orange-400' : cat.bgColor.includes('green') ? 'bg-emerald-500' : cat.bgColor.includes('blue') ? 'bg-blue-400' : cat.bgColor.includes('red') ? 'bg-red-400' : 'bg-stone-300'}`} />
    </button>
  );
}
