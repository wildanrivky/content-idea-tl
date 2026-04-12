"use server";

import { findUserByEmailAndPassword, updateUserLastLogin } from "@/lib/db";
import { setSession, clearSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Semua field harus diisi." };
  }

  const matchedUser = findUserByEmailAndPassword(email, password);

  if (!matchedUser) {
    return { error: "Email/Username atau Password salah." };
  }

  if (matchedUser.status !== "Aktif") {
    return { error: "Akun Anda sedang dinonaktifkan oleh Admin." };
  }

  updateUserLastLogin(matchedUser.id);

  await setSession({
    id: matchedUser.id,
    name: matchedUser.name,
    email: matchedUser.email,
    role: matchedUser.role,
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
