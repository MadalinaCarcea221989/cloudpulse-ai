import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export default async function globalTeardown() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for E2E teardown.");
  }

  const statePath = path.resolve(process.cwd(), "tests/e2e/.auth/user-id.json");
  let content;

  try {
    content = await fs.readFile(statePath, "utf-8");
  } catch {
    return;
  }

  const { userId } = JSON.parse(content);
  if (!userId) return;

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  await admin.auth.admin.deleteUser(userId);
  await fs.rm(statePath, { force: true });
}
