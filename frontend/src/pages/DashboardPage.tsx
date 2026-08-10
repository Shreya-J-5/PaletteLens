import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, Image as ImageIcon, FileText, Search, ArrowUpDown, 
  Trash2, ExternalLink, Calendar, Layers, Palette, Plus, Loader2
} from 'lucide-react';
import { fetchAnalysesList, deleteAnalysisRecord } from '../api/client';
import { Analysis } from '../types';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user, getUserAnalysisIds } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Analysis | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = () => {
    setLoading(true);
    fetchAnalysesList(filterType, sortBy, searchQuery)
      .then((data) => {
        const ownedIds = getUserAnalysisIds();
        // If user has specific tracked items, filter by them; if empty user session, show relevant history
        if (ownedIds && ownedIds.length > 0) {
          const userSpecific = data.filter((item) => ownedIds.includes(item.id));
          setAnalyses(userSpecific);
        } else {
          setAnalyses(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [filterType, sortBy, user?.email]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAnalysisRecord(deleteTarget.id);
      setAnalyses((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete analysis:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - d.getTime()) / 36e5;
    
    if (diffHours < 24) return 'Today';
    if (diffHours < 48) return 'Yesterday';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {user ? `Welcome back, ${user.name}` : 'Dashboard'}
          </h1>
          <p className="text-sm text-slate-500">
            {user
              ? `Showing saved palette history for ${user.email}`
              : 'Analyze something new or browse past design history.'}
          </p>
        </div>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-sky-400" />
          New Analysis
        </Link>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by URL or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          {/* Source Type Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            {['all', 'website', 'image', 'pdf'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-md capitalize transition-all ${
                  filterType === type
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'all' ? 'All' : type === 'website' ? 'Websites' : type === 'image' ? 'Images' : 'PDFs'}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most_colours">Most Colours</option>
              <option value="most_pages">Most Pages</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Grid / List */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto" />
          <p className="text-xs text-slate-500">Loading analysis history...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">No analyses found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {user
                ? `No palette extractions saved yet for ${user.email}. Create one now!`
                : 'Start your first color extraction by analyzing a website, image, or PDF file.'}
            </p>
          </div>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-xs"
          >
            Start Analysis
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {analyses.map((item) => {
            const title = item.source_url || item.original_filename || 'Untitled Analysis';
            return (
              <div
                key={item.id}
                className="group bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider bg-slate-100 text-slate-700 flex items-center gap-1.5">
                      {item.source_type === 'website' && <Globe className="w-3.5 h-3.5 text-sky-600" />}
                      {item.source_type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />}
                      {item.source_type === 'pdf' && <FileText className="w-3.5 h-3.5 text-emerald-600" />}
                      {item.source_type}
                    </span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      item.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      item.status === 'failed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-sky-600 transition-colors">
                    {title}
                  </h3>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.page_count} {item.page_count === 1 ? 'page' : 'pages'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.colour_count} colours</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDateLabel(item.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-2">
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete analysis"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Link
                    to={`/analysis/${item.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    View Results
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.source_url || deleteTarget?.original_filename || 'this analysis'}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};
