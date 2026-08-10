import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, Code, FileText, Palette, FileJson } from 'lucide-react';
import { getExportDownloadUrl, apiClient } from '../api/client';

interface ExportModalProps {
  analysisId: string;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ analysisId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'css' | 'json' | 'tailwind' | 'png'>('css');
  const [content, setContent] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'png') return;

    setLoading(true);
    apiClient.get(`/analyses/${analysisId}/export/${activeTab}`)
      .then((res) => {
        if (typeof res.data === 'object') {
          setContent(JSON.stringify(res.data, null, 2));
        } else {
          setContent(res.data);
        }
      })
      .catch((err) => {
        setContent('/* Failed to load export configuration */');
      })
      .finally(() => setLoading(false));
  }, [analysisId, activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pngUrl = getExportDownloadUrl(analysisId, 'png');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Export Palette</h3>
              <p className="text-xs text-slate-500">Download or copy in standard design formats</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('css')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition-colors ${
              activeTab === 'css'
                ? 'border-slate-900 text-slate-900 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            CSS Variables
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition-colors ${
              activeTab === 'json'
                ? 'border-slate-900 text-slate-900 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            JSON Format
          </button>

          <button
            onClick={() => setActiveTab('tailwind')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition-colors ${
              activeTab === 'tailwind'
                ? 'border-slate-900 text-slate-900 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Tailwind CSS
          </button>

          <button
            onClick={() => setActiveTab('png')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition-colors ${
              activeTab === 'png'
                ? 'border-slate-900 text-slate-900 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            PNG Image Swatch
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab !== 'png' ? (
            <div className="relative bg-slate-950 rounded-xl p-4 overflow-x-auto text-slate-200 font-mono text-xs shadow-inner">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-sans font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
              <pre className="pr-20 whitespace-pre">{loading ? 'Loading export structure...' : content}</pre>
            </div>
          ) : (
            <div className="text-center space-y-4 py-6">
              <div className="inline-block p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <Palette className="w-12 h-12 text-slate-700 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-900">Visual Palette Image</p>
                <p className="text-xs text-slate-500">High-resolution PNG featuring color cards and metadata</p>
              </div>

              <div>
                <a
                  href={pngUrl}
                  download={`palettelens_${analysisId}.png`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  Download PNG Palette Image
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
