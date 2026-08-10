export interface Colour {
  id: string;
  analysis_id: string;
  page_id?: string | null;
  hex: string;
  rgb_r: number;
  rgb_g: number;
  rgb_b: number;
  hsl_h: number;
  hsl_s: number;
  hsl_l: number;
  lab_l: number;
  lab_a: number;
  lab_b: number;
  usage_percentage: number;
  colour_role?: string | null;
  role_confidence?: 'Detected' | 'Inferred' | string | null;
  occurrence_count: number;
}

export interface AnalysisPage {
  id: string;
  analysis_id: string;
  url: string;
  page_title?: string | null;
  screenshot_path?: string | null;
  status: 'completed' | 'failed' | string;
  created_at: string;
  colours: Colour[];
}

export interface AnalysisAsset {
  id: string;
  analysis_id: string;
  file_path: string;
  asset_type: string;
  metadata_json?: string | null;
}

export interface Analysis {
  id: string;
  user_id?: string | null;
  source_type: 'website' | 'image' | 'pdf' | 'file';
  source_url?: string | null;
  original_filename?: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress_step?: string | null;
  created_at: string;
  completed_at?: string | null;
  error_message?: string | null;
  pages: AnalysisPage[];
  colours: Colour[];
  assets: AnalysisAsset[];
  page_count: number;
  colour_count: number;
}
