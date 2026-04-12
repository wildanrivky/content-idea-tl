import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Types ───────────────────────────────────────────────
export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  last_login: string | null;
};

// ─── Auth ────────────────────────────────────────────────
export async function getUserByIdentifier(identifier: string): Promise<User | null> {
  // Support login by email OR by username ("admin")
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .or(`email.eq.${identifier},name.eq.${identifier}`)
    .single();

  if (error || !data) return null;
  return data as User;
}

export async function updateLastLogin(id: number) {
  await supabase
    .from("users")
    .update({ last_login: new Date().toISOString() })
    .eq("id", id);
}

// ─── User Management (Admin) ─────────────────────────────
export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("id");
  if (error) return [];
  return data as User[];
}

export async function addUser(user: Omit<User, "id" | "last_login">) {
  const { data, error } = await supabase
    .from("users")
    .insert([{ ...user, last_login: null }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateUserStatus(id: number, status: string) {
  const { error } = await supabase
    .from("users")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteUser(id: number) {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}
