"use server";

import { supabase } from "@/lib/supabaseClient";
import { setSession, clearSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Semua fied harus diisi." };
  }

  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .ilike("email", email.trim())
    .eq("password", password);

  if (error || !users || users.length === 0) {
    return { error: "Email atau Password salah. Anda belum terdaftar." };
  }

  const matchedUser = users[0];

  if (matchedUser.status !== "Aktif") {
    return { error: "Akun Anda sedang dinonaktifkan oleh Admin." };
  }

  await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", matchedUser.id);

  // Set the HTTP-only cookie using the jose JWT utility
  await setSession({
    id: matchedUser.id,
    name: matchedUser.name,
    email: matchedUser.email,
    role: matchedUser.role
  });

  if (matchedUser.role === "Admin") {
    redirect("/admin");
  } else {
    redirect("/dashboard");
  }
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
