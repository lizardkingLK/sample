import { createClient } from "@refinedev/supabase";

const SUPABASE_URL = "https://ufvzftlgaxdlqbhzrqpb.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnpmdGxnYXhkbHFiaHpycXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc2MzAyMTcsImV4cCI6MjAwMzIwNjIxN30.6onjjiO6X6MRfk5dwG5nCxWtbyshzgI4lzJ8RAfonUw";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: {
    schema: "public",
  },
  auth: {
    persistSession: true,
  },
});
