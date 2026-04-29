import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Types pour Précieuse Empire (Supabase Schema)
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          short_description: string
          long_description: string
          price: number
          category: string
          skin_type: string
          badges: string[]
          stock: number
          is_visible: boolean
          images: string[]
          created_at: string
          modified_by: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          start_date: string
          location: string
          image_url: string
          status: 'draft' | 'published' | 'archived'
        }
      }
      // ... more defined as needed in components
    }
  }
}
