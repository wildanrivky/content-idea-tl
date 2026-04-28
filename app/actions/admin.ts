"use server";

import { getAllUsers, addUser, updateUserStatus, deleteUser, updateUserPassword, User } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUsersAction() {
  try {
    const users = await getAllUsers();
    return { success: true, data: users };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return { success: false, error: error.message || "Gagal memuat data pengguna." };
  }
}

export async function addUserAction(user: Omit<User, "id" | "last_login">) {
  try {
    const newUser = await addUser(user);
    revalidatePath("/admin");
    return { success: true, data: newUser };
  } catch (error: any) {
    console.error("Error adding user:", error);
    return { success: false, error: error.message || "Gagal menambah pengguna." };
  }
}

export async function toggleUserStatusAction(id: number, newStatus: string) {
  try {
    await updateUserStatus(id, newStatus);
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling user status:", error);
    return { success: false, error: error.message || "Gagal mengubah status pengguna." };
  }
}

export async function deleteUserAction(id: number) {
  try {
    await deleteUser(id);
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return { success: false, error: error.message || "Gagal menghapus pengguna." };
  }
}

export async function changePasswordAction(oldPassword: string, newPassword: string) {
  try {
    // Get current user from session
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: "Sesi tidak ditemukan. Silakan login ulang." };
    }

    // Get all users and find the current one
    const users = await getAllUsers();
    const currentUser = users.find((u) => String(u.id) === String(session.user.id));

    if (!currentUser) {
      return { success: false, error: "Akun tidak ditemukan." };
    }

    // Verify old password
    if (currentUser.password !== oldPassword) {
      return { success: false, error: "Password lama tidak sesuai." };
    }

    // Update password
    await updateUserPassword(currentUser.id, newPassword);

    return { success: true };
  } catch (error: any) {
    console.error("Error changing password:", error);
    return { success: false, error: error.message || "Gagal mengganti password." };
  }
}
