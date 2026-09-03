import { createClient } from "@supabase/supabase-js";

import { getServerConfig } from "./config.server";

export function getSupabaseServerClient() {
  const config = getServerConfig();

  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured");
  }

  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
