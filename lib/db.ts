import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

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

// ─── Setup ───────────────────────────────────────────────
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
// Handle private key formatting safely (some platforms escape newlines)
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";

let doc: GoogleSpreadsheet;

async function getDoc() {
  if (doc) return doc;
  
  const serviceAccountAuth = new JWT({
    email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

async function getSheet() {
  const document = await getDoc();
  // Asumsi data user ada di sheet pertama
  return document.sheetsByIndex[0];
}

// Helper to convert sheet row to User object
function rowToUser(row: any): User {
  return {
    id: parseInt(row.get("id")) || 0,
    name: row.get("name") || "",
    email: row.get("email") || "",
    password: row.get("password") || "",
    role: row.get("role") || "",
    status: row.get("status") || "",
    last_login: row.get("last_login") || null,
  };
}

// ─── Auth ────────────────────────────────────────────────
export async function getUserByIdentifier(identifier: string): Promise<User | null> {
  const sheet = await getSheet();
  const rows = await sheet.getRows();
  
  // Support login by email OR by username ("admin")
  const row = rows.find(
    (r) => r.get("email") === identifier || r.get("name") === identifier
  );

  if (!row) return null;
  return rowToUser(row);
}

export async function updateLastLogin(id: number) {
  const sheet = await getSheet();
  const rows = await sheet.getRows();
  
  const row = rows.find((r) => parseInt(r.get("id")) === id);
  if (row) {
    row.assign({ last_login: new Date().toISOString() });
    await row.save();
  }
}

// ─── User Management (Admin) ─────────────────────────────
export async function getAllUsers(): Promise<User[]> {
  const sheet = await getSheet();
  const rows = await sheet.getRows();
  
  return rows.map(rowToUser).sort((a, b) => a.id - b.id);
}

export async function addUser(user: Omit<User, "id" | "last_login">) {
  const sheet = await getSheet();
  const rows = await sheet.getRows();
  
  // Generate simple sequential ID or fallback
  let nextId = 1;
  if (rows.length > 0) {
    const maxId = Math.max(...rows.map((r) => parseInt(r.get("id")) || 0));
    nextId = maxId + 1;
  }

  const newUser = {
    id: nextId,
    ...user,
    last_login: "",
  };

  await sheet.addRow(newUser as any);
  return newUser;
}

export async function updateUserStatus(id: number, status: string) {
  const sheet = await getSheet();
  const rows = await sheet.getRows();
  
  const row = rows.find((r) => parseInt(r.get("id")) === id);
  if (row) {
    row.assign({ status });
    await row.save();
  } else {
    throw new Error("User not found");
  }
}

export async function deleteUser(id: number) {
  const sheet = await getSheet();
  const rows = await sheet.getRows();
  
  const row = rows.find((r) => parseInt(r.get("id")) === id);
  if (row) {
    await row.delete();
  } else {
    throw new Error("User not found");
  }
}

export async function updateUserPassword(id: number, newPassword: string) {
  const sheet = await getSheet();
  const rows = await sheet.getRows();
  
  const row = rows.find((r) => parseInt(r.get("id")) === id);
  if (row) {
    row.assign({ password: newPassword });
    await row.save();
  } else {
    throw new Error("User not found");
  }
}
