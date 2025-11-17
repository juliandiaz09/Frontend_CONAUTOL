import { Injectable } from '@angular/core';
import { supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  async getPublicPdfUrl(path: string): Promise<string | null> {
    // Para bucket público basta con:
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(path);

    return data.publicUrl;
  }
}
