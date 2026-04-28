"use server";

import { getAllUsers, addUser, updateUserStatus, deleteUser, User } from "@/lib/db";
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
