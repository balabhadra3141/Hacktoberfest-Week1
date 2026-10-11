import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../context/ReportsContext';
import { ReportCard } from '../components/ReportCard';
import { EmptyState, OfflineState } from '../components/States';
import type { ReportStatus } from '../types';
import { Sprout, TreePine, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_FILTERS: Array<{ value: ReportStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

export function Dashboard() {
  const { reports, seedSampleData, hasSeedData } = useReports();
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [isOffline] = useState(() => !navigator.onLine);
  const navigate = useNavigate();

  const filtered = statusFilter === 'all'
    ? reports
    : reports.filter((r) => r.status === statusFilter);

  const openCount = reports.filter((r) => r.status === 'open').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24">
      {/* Hero section */}
      <div className="pt-6 pb-4">
        <div className="bg-gradient-to-br from-forest-800 via-forest-700 to-emerald-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg">
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <TreePine className="w-5 h-5 text-emerald-300" />
              <span className="text-emerald-200 text-sm font-medium">Hacktoberfest 2026 · Week 1</span>
            </div>
            <h1 className="font-display text-2xl font-bold mb-1">Touch Grass.</h1>
            <h2 className="font-display text-2xl font-bold text-emerald-200 mb-3">Make it better.</h2>
            <p className="text-white/80 text-sm leading-relaxed mb-5">
              Spot a problem outside? Report it in 30 seconds and turn your walk into real community action.
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-2 bg-white text-forest-800 font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-sm text-sm"
            >
              <Sprout className="w-4 h-4" />
              Report an issue
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats row */}
      {reports.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total', value: reports.length, icon: '📋' },
            { label: 'Open', value: openCount, icon: '🔵' },
            { label: 'Resolved', value: resolvedCount, icon: '✅' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-stone-200 p-3 text-center shadow-sm">
              <div className="text-xl mb-0.5">{stat.icon}</div>
              <div className="font-bold text-forest-800 text-xl">{stat.value}</div>
              <div className="text-xs text-stone-500">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Seed data CTA */}
      {!hasSeedData && reports.length === 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-amber-800">Want to see a demo?</p>
            <p className="text-xs text-amber-600 mt-0.5">Load sample reports to explore the feed.</p>
          </div>
          <button
            onClick={seedSampleData}
            className="flex-shrink-0 text-sm font-semibold px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Load samples
          </button>
        </div>
      )}

      {/* Community note */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-forest-50 border border-forest-100 rounded-xl">
        <Users className="w-4 h-4 text-forest-600 flex-shrink-0" />
        <p className="text-xs text-forest-700">
          Reports are not independently verified. AI categorisation is a suggestion only — always use your own judgement.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-stone-100 rounded-xl mb-4">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`flex-1 text-sm font-medium py-1.5 px-2 rounded-lg transition-all ${
              statusFilter === f.value
                ? 'bg-white text-forest-800 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Report list */}
      {isOffline && reports.length === 0 ? (
        <OfflineState />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={statusFilter === 'all' ? 'No reports yet' : `No ${statusFilter.replace('_', ' ')} reports`}
          message={
            statusFilter === 'all'
              ? 'Be the first to report an environmental issue in your area.'
              : `No reports with "${statusFilter.replace('_', ' ')}" status.`
          }
          action={
            statusFilter === 'all' ? (
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-4 py-2 bg-forest-600 text-white text-sm font-medium rounded-lg hover:bg-forest-700 transition-colors"
              >
                <Sprout className="w-4 h-4" /> Report your first issue
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => navigate(`/report/${report.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
