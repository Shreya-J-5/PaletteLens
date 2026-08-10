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
    <div className="p-6 sm:p-8 space-y-7 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#DCDDD9] p-6 rounded-2xl shadow-2xs">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111318] tracking-tight">
            {user ? `Welcome back, ${user.name}` : 'Studio Dashboard'}
          </h1>
          <p className="text-xs text-[#666A73]">
            {user
              ? `Saved color palette history for ${user.email}`
              : 'Browse past color extractions or launch a new design analysis.'}
          </p>
        </div>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#111318] hover:bg-[#252830] text-white rounded-xl font-semibold text-xs transition-all self-start sm:self-auto shadow-2xs"
        >
          <Plus className="w-4 h-4 text-[#1677FF]" />
          New Analysis
        </Link>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3.5 border border-[#DCDDD9] rounded-xl shadow-2xs">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#8A8F98] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by URL or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F6F5F2] border border-[#DCDDD9] rounded-lg text-[#111318] placeholder:text-[#8A8F98] focus:outline-none focus:border-[#111318] focus:bg-white font-mono"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3">
          {/* Source Type Filter */}
          <div className="flex items-center gap-1 bg-[#F6F5F2] border border-[#DCDDD9] p-1 rounded-lg text-xs font-medium">
            {['all', 'website', 'image', 'pdf'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-md capitalize transition-all text-xs ${
                  filterType === type
                    ? 'bg-white text-[#111318] font-bold shadow-2xs border border-[#DCDDD9]'
                    : 'text-[#666A73] hover:text-[#111318]'
                }`}
              >
                {type === 'all' ? 'All' : type === 'website' ? 'Websites' : type === 'image' ? 'Images' : 'PDFs'}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8A8F98]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-[#F6F5F2] border border-[#DCDDD9] rounded-lg px-2.5 py-1.5 text-[#111318] font-medium focus:outline-none"
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
          <Loader2 className="w-7 h-7 animate-spin text-[#8A8F98] mx-auto" />
          <p className="text-xs text-[#666A73]">Loading color extractions...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="bg-white border border-[#DCDDD9] rounded-2xl p-12 text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-[#F6F5F2] border border-[#DCDDD9] text-[#111318] flex items-center justify-center mx-auto">
            <Palette className="w-6 h-6 text-[#1677FF]" />
          </div>
          <div>
            <h3 className="font-bold text-[#111318] text-base">No analyses found</h3>
            <p className="text-xs text-[#666A73] max-w-sm mx-auto mt-1">
              {user
                ? `No palette extractions saved yet for ${user.email}. Create one now!`
                : 'Start your first color extraction by analyzing a website, image, or PDF file.'}
            </p>
          </div>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#111318] text-white rounded-xl font-semibold text-xs shadow-2xs"
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
                className="group bg-white border border-[#DCDDD9] rounded-xl p-5 shadow-2xs hover:border-[#111318] transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-[#F6F5F2] border border-[#DCDDD9] text-[#111318] flex items-center gap-1.5">
                      {item.source_type === 'website' && <Globe className="w-3 h-3 text-[#1677FF]" />}
                      {item.source_type === 'image' && <ImageIcon className="w-3 h-3 text-[#111318]" />}
                      {item.source_type === 'pdf' && <FileText className="w-3 h-3 text-[#111318]" />}
                      {item.source_type}
                    </span>

                    <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded capitalize ${
                      item.status === 'completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      item.status === 'failed' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                      'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#111318] text-sm line-clamp-1 group-hover:text-[#1677FF] transition-colors">
                    {title}
                  </h3>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#DCDDD9]/70 text-[11px] font-medium text-[#666A73]">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#8A8F98]" />
                      <span>{item.page_count} {item.page_count === 1 ? 'page' : 'pages'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[#8A8F98]" />
                      <span>{item.colour_count} colours</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#8A8F98]" />
                      <span>{formatDateLabel(item.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3.5 mt-2">
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-md text-[#8A8F98] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete analysis"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    to={`/analysis/${item.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#111318] bg-[#F6F5F2] hover:bg-[#EBEAE5] border border-[#DCDDD9] rounded-lg transition-colors"
                  >
                    View Swatches
                    <ExternalLink className="w-3.5 h-3.5 text-[#1677FF]" />
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
