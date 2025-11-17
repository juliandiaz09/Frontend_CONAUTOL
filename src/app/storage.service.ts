import { Injectable } from '@angular/core';
import { supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  async getPublicUrl(bucket: string, path: string): Promise<string> {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }
}
