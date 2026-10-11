import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useReports } from '../context/ReportsContext';
import { CATEGORY_CONFIG, SEVERITY_CONFIG, STATUS_CONFIG } from '../lib/constants';
import { EmptyState } from '../components/States';
import type { ReportStatus } from '../types';
import { formatDistanceToNow, format } from 'date-fns';
import { ArrowLeft, MapPin, CheckCircle2, Clock, AlertTriangle, Trash2, ExternalLink } from 'lucide-react';

const NEXT_STATUS: Partial<Record<ReportStatus, ReportStatus>> = {
  open: 'in_progress',
  in_progress: 'resolved',
};

export function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = location.state?.isNew === true;
  const { reports, setStatus, removeReport } = useReports();

  const report = reports.find((r) => r.id === id);

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-10">
        <EmptyState
          title="Report not found"
          message="This report may have been deleted or does not exist."
          action={
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-forest-600 text-white text-sm font-medium rounded-lg hover:bg-forest-700 transition-colors"
            >
              Back to feed
            </button>
          }
        />
      </div>
    );
  }

  const cat = CATEGORY_CONFIG[report.analysis.category];
  const sev = SEVERITY_CONFIG[report.analysis.severity];
  const st = STATUS_CONFIG[report.status];
  const nextStatus = NEXT_STATUS[report.status];

  const handleDelete = () => {
    if (window.confirm('Delete this report? This cannot be undone.')) {
      removeReport(report.id);
      navigate('/');
    }
  };

  const confidencePct = Math.round(report.analysis.confidence * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 pt-4">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-forest-700 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to feed
      </button>

      {/* New report success banner */}
      {isNew && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">Report submitted!</p>
            <p className="text-xs text-emerald-600">AI analysis complete. See suggested next action below.</p>
          </div>
        </div>
      )}

      {/* Image */}
      {report.imageDataUrl && (
        <div className="rounded-2xl overflow-hidden border border-stone-200 mb-4 shadow-sm">
          <img
            src={report.imageDataUrl}
            alt="Issue photo"
            className="w-full max-h-72 object-cover"
          />
        </div>
      )}

      {/* Category + status header */}
      <div className={`rounded-2xl border p-4 mb-4 ${cat.bgColor}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{cat.emoji}</span>
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-0.5">Category</p>
              <h1 className={`font-display text-lg font-bold ${cat.color}`}>{cat.label}</h1>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${st.color}`}>
            {st.icon} {st.label}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-4 shadow-sm">
        <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Description</h2>
        <p className="text-stone-800 text-sm leading-relaxed">{report.analysis.shortDescription}</p>
        {report.userNote && (
          <p className="text-stone-500 text-sm mt-2 pt-2 border-t border-stone-100 italic">
            Your note: "{report.userNote}"
          </p>
        )}
      </div>

      {/* Severity + confidence */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">Severity</p>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${sev.color}`}>
            <span className={`w-2 h-2 rounded-full ${sev.dotColor}`} />
            {sev.label}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">AI Confidence</p>
          <div className="flex items-end gap-1.5">
            <span className="text-2xl font-bold text-stone-800">{confidencePct}%</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-forest-500 transition-all"
              style={{ width: `${confidencePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Uncertainty note — always shown */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Not verified:</strong> {report.analysis.uncertaintyNote}
        </p>
      </div>

      {/* Tags */}
      {report.analysis.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {report.analysis.tags.map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Safe next action — primary focus */}
      <div className="bg-forest-700 rounded-2xl p-5 mb-4 shadow-md">
        <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <ExternalLink className="w-3.5 h-3.5" /> Safe next action
        </p>
        <p className="text-white text-sm leading-relaxed font-medium">
          {report.analysis.safeNextAction}
        </p>
      </div>

      {/* Meta */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-4 shadow-sm space-y-2">
        {report.location && (
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0" />
            {report.location}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <Clock className="w-4 h-4 text-stone-400 flex-shrink-0" />
          {format(new Date(report.createdAt), 'PPP')} ·{' '}
          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
        </div>
        {report.isSampleData && (
          <div className="text-xs text-stone-400 italic border-t border-stone-100 pt-2">
            ℹ️ This is sample data generated for demonstration purposes.
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {nextStatus && (
          <button
            onClick={() => setStatus(report.id, nextStatus)}
            className="flex-1 py-3 bg-forest-600 hover:bg-forest-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark as {STATUS_CONFIG[nextStatus].label}
          </button>
        )}
        {report.status === 'resolved' && (
          <button
            onClick={() => setStatus(report.id, 'open')}
            className="flex-1 py-3 border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            Reopen
          </button>
        )}
        <button
          onClick={handleDelete}
          aria-label="Delete report"
          className="py-3 px-4 border border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-xl transition-colors flex items-center justify-center"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
