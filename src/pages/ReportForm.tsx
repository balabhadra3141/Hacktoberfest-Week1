import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../context/ReportsContext';
import { getProvider } from '../lib/providers';
import { createReport } from '../lib/storage';
import { LoadingSpinner } from '../components/States';
import { Camera, Upload, X, MapPin, FileText, Leaf } from 'lucide-react';
import type { CreateReportPayload } from '../types';

const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4 MB

function compressImage(dataUrl: string, maxDim = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export function ReportForm() {
  const { addReport } = useReports();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [imageMimeType, setImageMimeType] = useState<string | undefined>();
  const [location, setLocation] = useState('');
  const [userNote, setUserNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const provider = getProvider();
  const isSampleMode = !import.meta.env.VITE_USE_GEMINI || import.meta.env.VITE_USE_GEMINI !== 'true';

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image is too large. Please choose an image under 4 MB.');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const raw = e.target?.result as string;
      try {
        const compressed = await compressImage(raw);
        setImageDataUrl(compressed);
        setImageMimeType('image/jpeg');
      } catch {
        setImageDataUrl(raw);
        setImageMimeType(file.type);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
  }, [handleFile]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  }, [handleFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageDataUrl && !userNote.trim()) {
      setError('Please add a photo or describe the issue.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const payload: CreateReportPayload = {
        imageDataUrl,
        imageMimeType,
        location: location.trim() || undefined,
        userNote: userNote.trim() || undefined,
      };
      const analysis = await provider.analyze(payload);
      const report = createReport(analysis, {
        ...payload,
        isSampleData: isSampleMode,
      });
      addReport(report);
      navigate(`/report/${report.id}`, { state: { isNew: true } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-10">
        <LoadingSpinner label="Analysing your report…" />
        <p className="text-center text-xs text-stone-400 mt-2">
          {isSampleMode ? 'Running sample analysis (no AI call made)' : 'Sending to AI model…'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 pt-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-stone-900">Report an issue</h1>
        <p className="text-stone-500 text-sm mt-1">
          Snap a photo or describe what you see. We'll help categorise it and suggest a next action.
        </p>
      </div>

      {isSampleMode && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
          <span className="text-amber-500 text-base flex-shrink-0 mt-0.5">ℹ️</span>
          <div>
            <p className="text-sm font-medium text-amber-800">Sample data mode</p>
            <p className="text-xs text-amber-700 mt-0.5">
              No AI API is configured. Results will be illustrative sample data — not verified analysis.
              Set <code className="bg-amber-100 px-1 rounded">VITE_USE_GEMINI=true</code> and run the backend to enable real AI.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image upload */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Photo <span className="font-normal text-stone-400">(recommended)</span>
          </label>

          {imageDataUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
              <img src={imageDataUrl} alt="Issue preview" className="w-full max-h-56 object-cover" />
              <button
                type="button"
                onClick={() => { setImageDataUrl(undefined); setImageMimeType(undefined); }}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                EXIF data stripped on submission
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-stone-300 hover:border-forest-400 rounded-2xl p-6 transition-colors cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 bg-forest-50 group-hover:bg-forest-100 rounded-xl flex items-center justify-center transition-colors">
                  <Upload className="w-5 h-5 text-forest-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-700">Drop an image here or click to browse</p>
                  <p className="text-xs text-stone-400 mt-0.5">JPEG, PNG, WebP — max 4 MB</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="text-xs font-medium px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                    className="text-xs font-medium px-3 py-1.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" /> Camera
                  </button>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>

        {/* Location — general area only, no GPS */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-stone-700 mb-1.5">
            <MapPin className="w-3.5 h-3.5 inline mr-1" />
            General area <span className="font-normal text-stone-400">(optional)</span>
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Riverside Park, Bristol — do not include your full address"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent bg-white placeholder:text-stone-400"
          />
          <p className="text-xs text-stone-400 mt-1">Use a general description, not your home or GPS coordinates.</p>
        </div>

        {/* Note */}
        <div>
          <label htmlFor="note" className="block text-sm font-semibold text-stone-700 mb-1.5">
            <FileText className="w-3.5 h-3.5 inline mr-1" />
            Describe the issue <span className="font-normal text-stone-400">(optional if photo provided)</span>
          </label>
          <textarea
            id="note"
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            rows={3}
            placeholder="e.g. Overflowing bin near the main entrance, attracting foxes…"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent bg-white placeholder:text-stone-400 resize-none"
          />
        </div>

        {/* Privacy note */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-500 leading-relaxed">
          🔒 <strong>Privacy:</strong> Images are processed locally and compressed before any analysis.
          Never include identifiable faces or exact home addresses. Reports are stored only in your browser.
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-forest-600 hover:bg-forest-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
        >
          <Leaf className="w-4 h-4" />
          Submit report
        </button>
      </form>
    </div>
  );
}
