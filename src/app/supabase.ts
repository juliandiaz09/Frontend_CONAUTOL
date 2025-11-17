import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://omvklelyuuvgqbjzqbdk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdmtsZWx5dXV2Z3FianpxYmRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTM1NTEsImV4cCI6MjA3NTQyOTU1MX0.2Ju8fViAtpslMYzQy2baBG2t895ou8TDNAKitSD2sX4'
);
