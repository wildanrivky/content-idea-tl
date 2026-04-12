"use client";

import { useState, useEffect } from "react";
import { logoutAction } from "@/app/actions/auth";

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  last_login: string | null;
};

// Local in-memory users — shared via localStorage key "oatl_local_users"
const defaultUsers: User[] = [
  { id: 1, name: "Wildan Rivky", email: "admin", password: "admin123", role: "Admin", status: "Aktif", last_login: "2026-04-12T08:00:00Z" },
  { id: 2, name: "Budi Santoso", email: "budi@tourleader.id", password: "budi123", role: "Tour Leader", status: "Aktif", last_login: "2026-04-10T14:15:00Z" },
  { id: 3, name: "Siti Rahma", email: "siti@tourleader.id", password: "siti123", role: "Tour Leader", status: "Aktif", last_login: "2026-04-09T08:45:00Z" },
  { id: 4, name: "Alex Wijaya", email: "alex@tourleader.id", password: "alex123", role: "Tour Leader", status: "Tidak Aktif", last_login: "2026-03-20T11:20:00Z" },
];

function getUsersFromStorage(): User[] {
  try {
    const raw = localStorage.getItem("oatl_local_users");
    if (raw) return JSON.parse(raw) as User[];
  } catch {}
  return defaultUsers;
}

function saveUsersToStorage(users: User[]) {
  localStorage.setItem("oatl_local_users", JSON.stringify(users));
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: string }[]>([]);

  // Add User form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newRole, setNewRole] = useState("Tour Leader");

  useEffect(() => {
    const u = getUsersFromStorage();
    setUsers(u);
    setLoading(false);
  }, []);

  const showToast = (msg: string, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  const toggleStatus = (id: number) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, status: u.status === "Aktif" ? "Tidak Aktif" : "Aktif" } : u
    );
    setUsers(updated);
    saveUsersToStorage(updated);
    const user = updated.find((u) => u.id === id);
    showToast(`Status ${user?.name} → ${user?.status}`, user?.status === "Aktif" ? "success" : "info");
  };

  const deleteUser = (id: number) => {
    const user = users.find((u) => u.id === id);
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    saveUsersToStorage(updated);
    showToast(`${user?.name} dihapus dari sistem`, "info");
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPass) {
      showToast("Semua field harus diisi", "error");
      return;
    }
    const newUser: User = {
      id: Date.now(),
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      password: newPass,
      role: newRole,
      status: "Aktif",
      last_login: null,
    };
    const updated = [newUser, ...users];
    setUsers(updated);
    saveUsersToStorage(updated);
    setNewName(""); setNewEmail(""); setNewPass(""); setNewRole("Tour Leader");
    setIsAddOpen(false);
    showToast(`${newUser.name} berhasil ditambahkan!`, "success");
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAktif = users.filter((u) => u.status === "Aktif").length;

  return (
    <div className="relative min-h-screen" style={{ background: "var(--navy)" }}>
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0 map-grid" aria-hidden="true">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #EF4444 0%, transparent 70%)" }} />
      </div>

      {/* ─── HEADER ─────────────────────────────────── */}
      <header className="relative z-10 sticky top-0"
        style={{ background: "rgba(6,15,29,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(197,160,89,0.1)" }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)" }}>
              <i className="fas fa-shield-halved text-white" style={{ fontSize: "13px" }} />
            </div>
            <div>
              <div className="text-[14px] font-extrabold text-white">Admin <span style={{ color: "#f87171" }}>Portal</span></div>
              <div className="text-[10px] text-white/30">One App Tour Leader</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-[12px] text-white/30 px-3 py-1 rounded-lg"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <i className="fas fa-shield-check mr-1.5" style={{ color: "#f87171" }} />Admin Access
            </span>
            <form action={logoutAction}>
              <button type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", color: "#f87171" }}>
                <i className="fas fa-sign-out-alt" style={{ fontSize: "12px" }} />
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ─── MAIN ───────────────────────────────────── */}
      <main className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-8">
        {/* Page Title */}
        <div className="fade-in-up mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Manajemen Pengguna</h1>
          <p className="text-white/40 text-sm">Kelola akses Tour Leader yang terdaftar di One App Tour Leader</p>
        </div>

        {/* Stats */}
        <div className="fade-in-up-d1 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: "fa-users", label: "Total Terdaftar", value: users.length, color: "#C5A059" },
            { icon: "fa-user-check", label: "Akun Aktif", value: totalAktif, color: "#34d399" },
            { icon: "fa-user-xmark", label: "Tidak Aktif", value: users.length - totalAktif, color: "#f87171" },
            { icon: "fa-user-tie", label: "Tour Leader", value: users.filter(u => u.role === "Tour Leader").length, color: "#60a5fa" },
          ].map((s, i) => (
            <div key={i} className="stat-card flex flex-col items-center text-center py-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                style={{ background: `${s.color}16`, border: `1px solid ${s.color}26` }}>
                <i className={`fas ${s.icon}`} style={{ color: s.color, fontSize: "14px" }} />
              </div>
              <div className="text-2xl font-extrabold text-white mb-0.5">{s.value}</div>
              <div className="text-[11px] text-white/35">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table Header */}
        <div className="fade-in-up-d2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <i className="fas fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
                style={{ fontSize: "12px" }} />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau email..."
                className="input-gold w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20"
                style={{ background: "rgba(17,34,64,0.7)", border: "1px solid rgba(197,160,89,0.15)" }} />
            </div>
            {/* Add Button */}
            <button onClick={() => setIsAddOpen(true)}
              className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm flex-shrink-0">
              <i className="fas fa-plus" style={{ fontSize: "12px" }} />
              Tambah Pengguna
            </button>
          </div>

          {/* Table */}
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/20"
            style={{ background: "rgba(17,34,64,0.7)", border: "1px solid rgba(197,160,89,0.1)", backdropFilter: "blur(8px)" }}>
            {/* Table Head */}
            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3.5 border-b"
              style={{ borderColor: "rgba(197,160,89,0.08)", background: "rgba(6,15,29,0.5)" }}>
              {["Pengguna", "Role / Status", "Password", "Login Terakhir", "Aksi"].map((h) => (
                <div key={h} className="text-[11px] font-bold uppercase tracking-widest text-white/25">{h}</div>
              ))}
            </div>

            {/* Table Body */}
            {loading ? (
              <div className="p-10 text-center text-white/25 text-sm">Memuat data...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-10 text-center text-white/25 text-sm">
                <i className="fas fa-users-slash mb-2" style={{ fontSize: "28px" }} />
                <p className="mt-2">Tidak ada pengguna ditemukan</p>
              </div>
            ) : (
              filteredUsers.map((u, i) => (
                <div key={u.id}
                  className="grid sm:grid-cols-[2fr_1fr_1fr_1fr_auto] grid-cols-1 gap-4 px-6 py-4 items-center transition-colors"
                  style={{
                    borderBottom: i < filteredUsers.length - 1 ? "1px solid rgba(197,160,89,0.06)" : "none",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.015)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>

                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                      style={{ background: "linear-gradient(135deg, var(--gold), var(--gold-dark))", color: "var(--navy-dark)" }}>
                      {u.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-white/85 text-[14px] truncate">{u.name}</div>
                      <div className="text-[11px] text-white/35 truncate">{u.email}</div>
                    </div>
                  </div>

                  {/* Role & Status */}
                  <div className="flex flex-col gap-1.5">
                    <span className={`self-start inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      u.status === "Aktif"
                        ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                        : "text-red-400 border-red-500/20 bg-red-500/10"
                    } border`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Aktif" ? "bg-emerald-400" : "bg-red-400"}`} />
                      {u.status}
                    </span>
                    <span className="self-start text-[10px] font-semibold px-2 py-0.5 rounded text-white/35"
                      style={{ background: "rgba(255,255,255,0.04)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {u.role}
                    </span>
                  </div>

                  {/* Password */}
                  <div className="font-mono text-[12px]" style={{ color: "rgba(197,160,89,0.7)" }}>
                    {u.password}
                  </div>

                  {/* Last Login */}
                  <div className="text-[12px] text-white/30">
                    {u.last_login
                      ? new Date(u.last_login).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                      : "Belum pernah"}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleStatus(u.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      title={u.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                      style={{ border: `1px solid ${u.status === "Aktif" ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`, background: u.status === "Aktif" ? "rgba(239,68,68,0.06)" : "rgba(34,197,94,0.06)", color: u.status === "Aktif" ? "#f87171" : "#4ade80" }}>
                      <i className={`fas ${u.status === "Aktif" ? "fa-ban" : "fa-check"}`} style={{ fontSize: "11px" }} />
                    </button>
                    <button onClick={() => deleteUser(u.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      title="Hapus pengguna"
                      style={{ border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.04)", color: "rgba(248,113,113,0.5)" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.12)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(248,113,113,0.5)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.04)"; }}>
                      <i className="fas fa-trash" style={{ fontSize: "11px" }} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* ─── ADD USER MODAL ─────────────────────────── */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/65" style={{ backdropFilter: "blur(6px)" }}
            onClick={() => setIsAddOpen(false)} />
          <div className="modal-enter relative rounded-2xl max-w-sm w-full shadow-2xl flex flex-col overflow-hidden"
            style={{ background: "#112240", border: "1px solid rgba(197,160,89,0.15)" }}>
            <div className="px-6 py-4 flex items-center justify-between border-b"
              style={{ borderColor: "rgba(197,160,89,0.1)" }}>
              <h3 className="text-[15px] font-bold text-white">Tambah Pengguna Baru</h3>
              <button onClick={() => setIsAddOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <i className="fas fa-xmark" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              {[
                { label: "Nama Lengkap", icon: "fa-user", value: newName, setter: setNewName, placeholder: "Contoh: Budi Santoso", type: "text" },
                { label: "Email", icon: "fa-envelope", value: newEmail, setter: setNewEmail, placeholder: "email@tourleader.id", type: "email" },
                { label: "Password Awal", icon: "fa-lock", value: newPass, setter: setNewPass, placeholder: "Buat password sementara", type: "text" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35 mb-2">{field.label}</label>
                  <div className="relative">
                    <i className={`fas ${field.icon} absolute left-3.5 top-1/2 -translate-y-1/2`}
                      style={{ color: "rgba(197,160,89,0.45)", fontSize: "12px" }} />
                    <input type={field.type} required value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      placeholder={field.placeholder}
                      className="input-gold w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20"
                      style={{ background: "rgba(6,15,29,0.6)", border: "1px solid rgba(197,160,89,0.15)" }} />
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35 mb-2">Role</label>
                <div className="relative">
                  <i className="fas fa-briefcase absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(197,160,89,0.45)", fontSize: "12px" }} />
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)}
                    className="input-gold w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white appearance-none"
                    style={{ background: "rgba(6,15,29,0.6)", border: "1px solid rgba(197,160,89,0.15)" }}>
                    <option value="Tour Leader">Tour Leader</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20" style={{ fontSize: "10px" }} />
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="btn-primary w-full py-3 rounded-xl text-sm font-bold">
                  <i className="fas fa-user-plus mr-2" style={{ fontSize: "12px" }} />
                  Tambahkan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── TOAST ─────────────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-[90] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-xl text-white"
            style={{
              background: t.type === "error" ? "rgba(220,38,38,0.92)" : t.type === "info"
                ? "rgba(17,34,64,0.95)" : "rgba(5,150,105,0.92)",
              border: t.type === "info" ? "1px solid rgba(197,160,89,0.25)" : "none",
              backdropFilter: "blur(12px)", animation: "fadeInUp 0.3s ease",
            }}>
            <i className={`fas ${t.type === "error" ? "fa-circle-exclamation" : t.type === "info" ? "fa-circle-info" : "fa-circle-check"} opacity-80`} />
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
