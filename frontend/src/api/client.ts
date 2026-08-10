import axios from 'axios';
import { Analysis, AnalysisPage, Colour } from '../types';

const API_BASE_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

export const createWebsiteAnalysis = async (url: string): Promise<{ id: string; status: string; progress_step?: string }> => {
  const formData = new FormData();
  formData.append('source_type', 'website');
  formData.append('source_url', url);

  const response = await apiClient.post('/analyses', formData);
  return response.data;
};

export const createFileUploadAnalysis = async (file: File, sourceType: 'image' | 'pdf' | 'file'): Promise<{ id: string; status: string; progress_step?: string }> => {
  const formData = new FormData();
  formData.append('source_type', sourceType);
  formData.append('file', file);

  const response = await apiClient.post('/analyses', formData);
  return response.data;
};

export const fetchAnalysesList = async (
  sourceType?: string,
  sortBy?: string,
  searchQuery?: string
): Promise<Analysis[]> => {
  const params: Record<string, string> = {};
  if (sourceType && sourceType !== 'all') params.source_type = sourceType;
  if (sortBy) params.sort_by = sortBy;
  if (searchQuery) params.q = searchQuery;

  const response = await apiClient.get('/analyses', { params });
  return response.data;
};

export const fetchAnalysisDetail = async (id: string): Promise<Analysis> => {
  const response = await apiClient.get(`/analyses/${id}`);
  return response.data;
};

export const deleteAnalysisRecord = async (id: string): Promise<void> => {
  await apiClient.delete(`/analyses/${id}`);
};

export const fetchPageDetail = async (analysisId: string, pageId: string): Promise<AnalysisPage> => {
  const response = await apiClient.get(`/analyses/${analysisId}/pages/${pageId}`);
  return response.data;
};

export const getExportDownloadUrl = (analysisId: string, format: 'json' | 'css' | 'tailwind' | 'png'): string => {
  return `${API_BASE_URL}/analyses/${analysisId}/export/${format}`;
};
