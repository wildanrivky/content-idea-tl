import { NextResponse } from "next/server";
import { addUser, getAllUsers } from "@/lib/db";

const API_SECRET = process.env.SURVEY_API_SECRET || "oatl-survey-secret-2026";

export async function POST(req: Request) {
  try {
    // Validate secret key
    const authHeader = req.headers.get("x-api-secret");
    if (authHeader !== API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await req.json();

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check for duplicate email
    const existingUsers = await getAllUsers();
    const duplicate = existingUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (duplicate) {
      // Return success but indicate already registered (don't block WA redirect)
      return NextResponse.json({ success: true, alreadyExists: true });
    }

    // Create new user with default password
    await addUser({
      name: cleanName,
      email: cleanEmail,
      password: "123456",
      role: "Tour Leader",
      status: "Aktif",
    });

    return NextResponse.json({ success: true, alreadyExists: false });
  } catch (error: any) {
    console.error("Register from survey error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
