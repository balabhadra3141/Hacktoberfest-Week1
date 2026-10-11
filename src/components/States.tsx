import { AlertTriangle, Wifi } from 'lucide-react';

interface Props {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message, retry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <h3 className="font-semibold text-stone-800 mb-1">{title}</h3>
      <p className="text-sm text-stone-500 max-w-xs mb-4">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 text-sm font-medium bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function OfflineState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mb-4">
        <Wifi className="w-7 h-7 text-stone-400" />
      </div>
      <h3 className="font-semibold text-stone-800 mb-1">You're offline</h3>
      <p className="text-sm text-stone-500 max-w-xs">
        EcoQuest works offline for browsing saved reports. Reconnect to submit new reports with AI analysis.
      </p>
    </div>
  );
}

export function EmptyState({
  title = 'No reports yet',
  message = 'Be the first to report an environmental issue in your area.',
  action,
}: {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4">🌱</div>
      <h3 className="font-semibold text-stone-800 mb-1">{title}</h3>
      <p className="text-sm text-stone-500 max-w-xs mb-4">{message}</p>
      {action}
    </div>
  );
}

export function LoadingSpinner({ label = 'Analysing...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-stone-100" />
        <div className="absolute inset-0 rounded-full border-4 border-forest-500 border-t-transparent animate-spin" />
        <div className="absolute inset-3 flex items-center justify-center text-xl">🌿</div>
      </div>
      <p className="text-sm font-medium text-stone-600 animate-pulse">{label}</p>
    </div>
  );
}
