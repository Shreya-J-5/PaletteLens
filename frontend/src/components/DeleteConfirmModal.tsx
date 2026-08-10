import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  onConfirm,
  onCancel,
  isDeleting = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#16171B] border border-[#262830] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-white relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-[#9CA3AF] hover:text-white hover:bg-[#1E2026] rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Delete Palette Record</h3>
            <p className="text-xs text-[#9CA3AF]">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-xs text-[#9CA3AF] leading-relaxed">
          Are you sure you want to permanently delete <strong className="text-white font-mono">{title}</strong>? All calculated color clusters, page previews, and metadata will be permanently removed.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1E2026] border border-[#262830] hover:bg-[#252833] rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? 'Deleting...' : 'Delete Analysis'}
          </button>
        </div>
      </div>
    </div>
  );
};
