"use server";

import { redirect } from "next/navigation";
import { setSession, clearSession } from "@/lib/auth";
import { getUserByIdentifier, updateLastLogin } from "@/lib/db";

export type AuthState = {
  error?: string;
} | null;

export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const identifier = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    return { error: "Email/username dan password wajib diisi." };
  }

  // Cari user di Supabase
  const user = await getUserByIdentifier(identifier);

  if (!user) {
    return { error: "Akun tidak ditemukan." };
  }

  if (user.password !== password) {
    return { error: "Password salah." };
  }

  if (user.status !== "Aktif") {
    return { error: "Akun Anda tidak aktif. Hubungi admin." };
  }

  // Update last login
  await updateLastLogin(user.id);

  // Set JWT session
  await setSession({
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
  });

  // Redirect berdasarkan role
  if (user.role === "Admin") {
    redirect("/admin");
  } else {
    redirect("/dashboard");
  }
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
