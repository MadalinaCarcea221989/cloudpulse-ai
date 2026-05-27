import { createClient } from "@supabase/supabase-js";

const email = process.env.E2E_TEST_EMAIL || "e2e-test-user@cloudpulse.test";
const password = process.env.E2E_TEST_PASSWORD || "TestPassword123!";

export default async function globalSetup() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for E2E setup.");
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error && error.message.toLowerCase().includes("already registered")) {
    return async () => {
      await deleteUserByEmail(admin, email);
    };
  }

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("Failed to create E2E test user.");
  }

  return async () => {
    await deleteUserByEmail(admin, email);
  };
}

async function deleteUserByEmail(admin: ReturnType<typeof createClient>, targetEmail: string) {
  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  if (error) {
    throw error;
  }

  const user = data.users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());
  if (user) {
    await admin.auth.admin.deleteUser(user.id);
  }
}
