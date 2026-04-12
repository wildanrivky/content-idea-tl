// LOCAL USER DATABASE — will be replaced with Supabase after deploy
export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "Tour Leader" | "Admin";
  status: "Aktif" | "Tidak Aktif";
  last_login: string | null;
};

let users: User[] = [
  {
    id: 1,
    name: "Wildan Rivky",
    email: "admin",
    password: "admin123",
    role: "Admin",
    status: "Aktif",
    last_login: "2026-04-12T08:00:00Z",
  },
  {
    id: 2,
    name: "Budi Santoso",
    email: "budi@tourleader.id",
    password: "budi123",
    role: "Tour Leader",
    status: "Aktif",
    last_login: "2026-04-10T14:15:00Z",
  },
  {
    id: 3,
    name: "Siti Rahma",
    email: "siti@tourleader.id",
    password: "siti123",
    role: "Tour Leader",
    status: "Aktif",
    last_login: "2026-04-09T08:45:00Z",
  },
  {
    id: 4,
    name: "Alex Wijaya",
    email: "alex@tourleader.id",
    password: "alex123",
    role: "Tour Leader",
    status: "Tidak Aktif",
    last_login: "2026-03-20T11:20:00Z",
  },
];

export function getAllUsers(): User[] {
  return users;
}

export function findUserByEmailAndPassword(email: string, password: string): User | null {
  const lower = email.trim().toLowerCase();
  return (
    users.find(
      (u) =>
        (u.email.toLowerCase() === lower || u.email === email) &&
        u.password === password
    ) || null
  );
}

export function addUser(user: Omit<User, "id">): User {
  const newUser = { ...user, id: Date.now() };
  users.push(newUser);
  return newUser;
}

export function updateUserStatus(id: number, status: "Aktif" | "Tidak Aktif") {
  users = users.map((u) => (u.id === id ? { ...u, status } : u));
}

export function updateUserLastLogin(id: number) {
  users = users.map((u) =>
    u.id === id ? { ...u, last_login: new Date().toISOString() } : u
  );
}

export function deleteUser(id: number) {
  users = users.filter((u) => u.id !== id);
}
