import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Real-time subscription for new messages
export const subscribeToNewMessages = (callback: (payload: any) => void) => {
  return supabase
    .channel('messages')
    .on('INSERT', callback)
    .subscribe();
};