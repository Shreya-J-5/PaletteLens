import { Analysis, Colour } from '../types';

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  let rs = r / 255;
  let gs = g / 255;
  let bs = b / 255;

  rs = rs > 0.04045 ? Math.pow((rs + 0.055) / 1.055, 2.4) : rs / 12.92;
  gs = gs > 0.04045 ? Math.pow((gs + 0.055) / 1.055, 2.4) : gs / 12.92;
  bs = bs > 0.04045 ? Math.pow((bs + 0.055) / 1.055, 2.4) : bs / 12.92;

  let x = (rs * 0.4124564 + gs * 0.3575761 + bs * 0.1804375) / 0.95047;
  let y = (rs * 0.2126729 + gs * 0.7151522 + bs * 0.0721750) / 1.00000;
  let z = (rs * 0.0193339 + gs * 0.1191920 + bs * 0.9503041) / 1.08883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

  const L = (116 * y) - 16;
  const a = 500 * (x - y);
  const bVal = 200 * (y - z);

  return [Math.round(L * 100) / 100, Math.round(a * 100) / 100, Math.round(bVal * 100) / 100];
}

function colorDistance(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
}

export const extractColorsClientSide = async (file: File): Promise<Analysis> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        const maxDim = 300;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        const totalPixels = width * height;

        const clusters: Array<{ rgb: [number, number, number]; count: number }> = [];

        for (let i = 0; i < pixels.length; i += 16) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          if (a < 128) continue; // Ignore transparent pixels

          let found = false;
          for (const cluster of clusters) {
            if (colorDistance([r, g, b], cluster.rgb) < 32) {
              cluster.count++;
              found = true;
              break;
            }
          }

          if (!found) {
            clusters.push({ rgb: [r, g, b], count: 1 });
          }
        }

        clusters.sort((a, b) => b.count - a.count);
        const topClusters = clusters.slice(0, 16);
        const clusterTotal = topClusters.reduce((sum, c) => sum + c.count, 0) || 1;

        const analysisId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

        const colours: Colour[] = topClusters.map((cluster, idx) => {
          const [r, g, b] = cluster.rgb;
          const hex = rgbToHex(r, g, b);
          const [h, s, l] = rgbToHsl(r, g, b);
          const [labL, labA, labB] = rgbToLab(r, g, b);
          const pct = Math.round((cluster.count / clusterTotal) * 1000) / 10;

          let role = 'Surface';
          if (idx === 0) role = 'Background';
          else if (idx === 1 && s > 30) role = 'Primary';
          else if (s > 50) role = 'Accent';
          else if (l < 25 || l > 85) role = 'Text';

          return {
            id: `${analysisId}_col_${idx}`,
            analysis_id: analysisId,
            page_id: null,
            hex,
            rgb_r: r,
            rgb_g: g,
            rgb_b: b,
            hsl_h: h,
            hsl_s: s,
            hsl_l: l,
            lab_l: labL,
            lab_a: labA,
            lab_b: labB,
            usage_percentage: pct,
            colour_role: role,
            role_confidence: 'Detected',
            occurrence_count: cluster.count
          };
        });

        const analysis: Analysis = {
          id: analysisId,
          source_type: 'image',
          source_url: null,
          original_filename: file.name,
          status: 'completed',
          progress_step: 'Results saved',
          error_message: null,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          page_count: 1,
          colour_count: colours.length,
          pages: [],
          colours,
          assets: []
        };

        // Persist to local storage map
        localStorage.setItem(`palettelens_analysis_${analysisId}`, JSON.stringify(analysis));
        
        // Also add to global list if exists
        try {
          const listStr = localStorage.getItem('palettelens_local_analyses_list');
          const listObj: Analysis[] = listStr ? JSON.parse(listStr) : [];
          listObj.unshift(analysis);
          localStorage.setItem('palettelens_local_analyses_list', JSON.stringify(listObj));
        } catch {
          // ignore
        }

        resolve(analysis);
      };

      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};
