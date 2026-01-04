import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client if environment variables are not set
const createMockClient = () => {
  return {
    from: (table: string) => ({
      select: (columns?: string) => {
        // Return empty data instead of error for better UX
        return Promise.resolve({ data: null, error: null })
      },
      insert: (values: any) => {
        // Return success for form submissions
        return Promise.resolve({ data: null, error: null })
      },
      order: (column: string, options?: { ascending?: boolean }) => {
        return {
          select: (columns?: string) => Promise.resolve({ data: null, error: null }),
        }
      },
      eq: (column: string, value: any) => {
        return {
          select: (columns?: string) => Promise.resolve({ data: null, error: null }),
        }
      },
      limit: (count: number) => {
        return Promise.resolve({ data: null, error: null })
      },
    }),
  } as any
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockClient()

// Helper to check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

