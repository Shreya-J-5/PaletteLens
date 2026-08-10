import axios from 'axios';
import { Analysis, AnalysisPage, Colour } from '../types';
import { extractColorsClientSide, extractColorsFromWebsiteUrl, createFallbackAnalysis } from '../utils/clientColorExtractor';

const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 30000,
});

export const createWebsiteAnalysis = async (url: string): Promise<{ id: string; status: string; progress_step?: string }> => {
  try {
    const formData = new FormData();
    formData.append('source_type', 'website');
    formData.append('source_url', url);

    const response = await apiClient.post('/analyses', formData);
    return response.data;
  } catch (error) {
    console.warn('Backend website analysis error. Executing fallback website analysis...');
    const localAnalysis = await extractColorsFromWebsiteUrl(url);
    return {
      id: localAnalysis.id,
      status: 'completed',
      progress_step: 'Results saved'
    };
  }
};

export const createFileUploadAnalysis = async (file: File, sourceType: 'image' | 'pdf' | 'file'): Promise<{ id: string; status: string; progress_step?: string }> => {
  try {
    const formData = new FormData();
    formData.append('source_type', sourceType);
    formData.append('file', file);

    const response = await apiClient.post('/analyses', formData);
    return response.data;
  } catch (error) {
    console.warn('Backend upload returned error. Executing client-side extraction fallback...');
    let localAnalysis;
    if (sourceType === 'image' || file.type.startsWith('image/')) {
      localAnalysis = await extractColorsClientSide(file);
    } else {
      localAnalysis = createFallbackAnalysis(file.name, sourceType === 'pdf' ? 'pdf' : 'file');
    }
    return {
      id: localAnalysis.id,
      status: 'completed',
      progress_step: 'Results saved'
    };
  }
};

export const fetchAnalysesList = async (
  sourceType?: string,
  sortBy?: string,
  searchQuery?: string
): Promise<Analysis[]> => {
  let apiAnalyses: Analysis[] = [];
  try {
    const params: Record<string, string> = {};
    if (sourceType && sourceType !== 'all') params.source_type = sourceType;
    if (sortBy) params.sort_by = sortBy;
    if (searchQuery) params.q = searchQuery;

    const response = await apiClient.get('/analyses', { params });
    apiAnalyses = response.data;
  } catch (err) {
    console.warn('Backend API list fetch warning:', err);
  }

  let localAnalyses: Analysis[] = [];
  try {
    const localStr = localStorage.getItem('palettelens_local_analyses_list');
    if (localStr) {
      localAnalyses = JSON.parse(localStr);
    }
  } catch {
    // ignore
  }

  if (sourceType && sourceType !== 'all') {
    localAnalyses = localAnalyses.filter(a => a.source_type === sourceType);
  }
  if (searchQuery) {
    const qLower = searchQuery.toLowerCase();
    localAnalyses = localAnalyses.filter(a =>
      (a.original_filename && a.original_filename.toLowerCase().includes(qLower)) ||
      (a.source_url && a.source_url.toLowerCase().includes(qLower))
    );
  }

  const combinedMap = new Map<string, Analysis>();
  localAnalyses.forEach(a => combinedMap.set(a.id, a));
  apiAnalyses.forEach(a => combinedMap.set(a.id, a));

  const result = Array.from(combinedMap.values());
  if (sortBy === 'oldest') {
    result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  } else {
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return result;
};

export const fetchAnalysisDetail = async (id: string): Promise<Analysis> => {
  if (id.startsWith('local_')) {
    const stored = localStorage.getItem(`palettelens_analysis_${id}`);
    if (stored) {
      return JSON.parse(stored);
    }
  }

  try {
    const response = await apiClient.get(`/analyses/${id}`);
    return response.data;
  } catch (error) {
    const stored = localStorage.getItem(`palettelens_analysis_${id}`);
    if (stored) {
      return JSON.parse(stored);
    }
    throw error;
  }
};

export const deleteAnalysisRecord = async (id: string): Promise<void> => {
  if (id.startsWith('local_')) {
    localStorage.removeItem(`palettelens_analysis_${id}`);
    try {
      const localStr = localStorage.getItem('palettelens_local_analyses_list');
      if (localStr) {
        let list: Analysis[] = JSON.parse(localStr);
        list = list.filter(a => a.id !== id);
        localStorage.setItem('palettelens_local_analyses_list', JSON.stringify(list));
      }
    } catch {
      // ignore
    }
    return;
  }

  try {
    await apiClient.delete(`/analyses/${id}`);
  } catch (err) {
    console.warn('Backend delete failed, removing locally if stored:', err);
  }
};

export const fetchPageDetail = async (analysisId: string, pageId: string): Promise<AnalysisPage> => {
  const response = await apiClient.get(`/analyses/${analysisId}/pages/${pageId}`);
  return response.data;
};

export const getExportDownloadUrl = (analysisId: string, format: 'json' | 'css' | 'tailwind' | 'png'): string => {
  return `${API_BASE_URL}/analyses/${analysisId}/export/${format}`;
};
