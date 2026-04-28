"use client";

import { useEffect, useState, useCallback } from "react";
import { logoutAction } from "@/app/actions/auth";
import { getUsersAction, addUserAction, toggleUserStatusAction, deleteUserAction } from "@/app/actions/admin";

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  last_login: string | null;
};

const EMPTY_FORM = { name: "", email: "", password: "", role: "Tour Leader" };

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: string }[]>([]);

  const showToast = (msg: string, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await getUsersAction();
    if (res.success && res.data) {
      setUsers(res.data as User[]);
    } else {
      showToast(res.error || "Gagal mengambil data", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "Aktif").length,
    inactive: users.filter((u) => u.status !== "Aktif").length,
    tl: users.filter((u) => u.role === "Tour Leader").length,
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "Aktif" ? "Tidak Aktif" : "Aktif";
    
    // Optimistic UI update
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: newStatus } : u));
    
    const res = await toggleUserStatusAction(user.id, newStatus);
    if (!res.success) {
      showToast(res.error || "Gagal mengubah status", "error"); 
      // Revert if failed
      fetchUsers();
      return; 
    }
    showToast(`${user.name} — status diubah ke ${newStatus}`, "success");
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Hapus akun "${user.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    
    const res = await deleteUserAction(user.id);
    if (!res.success) { 
      showToast(res.error || "Gagal menghapus user", "error"); 
      return; 
    }
    showToast(`Akun "${user.name}" berhasil dihapus`, "info");
    fetchUsers();
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      showToast("Semua field wajib diisi", "error"); return;
    }
    setSaving(true);
    
    const res = await addUserAction({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
      status: "Aktif",
    });

    setSaving(false);
    
    if (!res.success) { 
      showToast(`Gagal: ${res.error}`, "error"); 
      return; 
    }
    
    showToast(`Akun "${form.name}" berhasil ditambahkan!`, "success");
    setForm(EMPTY_FORM);
    setShowModal(false);
    fetchUsers();
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--navy-dark)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 sticky top-0 z-30"
        style={{ background: "rgba(4,10,22,0.95)", borderBottom: "1px solid rgba(197,160,89,0.12)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <i className="fas fa-user-shield" style={{ color: "#f87171", fontSize: "13px" }} />
          </div>
          <div>
            <div className="text-[14px] font-bold">
              <span style={{ color: "var(--gold-light)" }}>Admin</span>
              <span className="text-white"> Portal</span>
            </div>
            <div className="text-[10px] text-white/25">One App Tour Leader</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/30 hidden sm:block">Admin Access</span>
          <form action={logoutAction}>
            <button type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
              <i className="fas fa-sign-out-alt" style={{ fontSize: "11px" }} />
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white">Manajemen Pengguna</h1>
          <p className="text-white/35 text-[13px] mt-1">
            Kelola akses Tour Leader yang terdaftar di One App Tour Leader
            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>
              ● Google Sheets Live
            </span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Terdaftar", value: stats.total, icon: "fa-users", color: "#C5A059" },
            { label: "Akun Aktif",      value: stats.active,   icon: "fa-user-check", color: "#4ade80" },
            { label: "Tidak Aktif",    value: stats.inactive, icon: "fa-user-xmark", color: "#f87171" },
            { label: "Tour Leader",    value: stats.tl,       icon: "fa-id-badge",   color: "#60a5fa" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4 text-center"
              style={{ background: "rgba(17,34,64,0.7)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <i className={`fas ${s.icon} text-2xl mb-2`} style={{ color: s.color }} />
              <div className="text-2xl font-black text-white">{loading ? "…" : s.value}</div>
              <div className="text-[11px] text-white/35 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <i className="fas fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" style={{ fontSize: "13px" }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] font-medium text-white bg-transparent outline-none"
              style={{ background: "rgba(17,34,64,0.6)", border: "1px solid rgba(255,255,255,0.08)" }} />
          </div>
          <button onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] whitespace-nowrap">
            <i className="fas fa-plus" />
            Tambah Pengguna
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Table Header */}
          <div className="grid grid-cols-12 px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-white/25"
            style={{ background: "rgba(10,20,40,0.8)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="col-span-4">Pengguna</div>
            <div className="col-span-2">Role / Status</div>
            <div className="col-span-2">Password</div>
            <div className="col-span-2">Login Terakhir</div>
            <div className="col-span-2 text-right">Aksi</div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-white/30">
              <i className="fas fa-circle-notch fa-spin text-2xl" style={{ color: "var(--gold)" }} />
              <p className="mt-3 text-[13px]">Memuat data dari Google Sheets…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-white/30">
              <i className="fas fa-users-slash text-3xl mb-3 block" />
              <p className="text-[13px]">{search ? "Tidak ada hasil pencarian" : "Belum ada pengguna"}</p>
            </div>
          ) : (
            filtered.map((user, i) => (
              <div key={user.id}
                className="grid grid-cols-12 px-5 py-4 items-center transition-colors"
                style={{
                  background: i % 2 === 0 ? "rgba(17,34,64,0.5)" : "rgba(10,20,40,0.4)",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}>
                {/* Name + email */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[14px]"
                    style={{ background: "linear-gradient(135deg, var(--gold), var(--gold-dark))", color: "var(--navy-dark)" }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold text-white truncate">{user.name}</div>
                    <div className="text-[11px] text-white/35 truncate">{user.email}</div>
                  </div>
                </div>

                {/* Role + Status */}
                <div className="col-span-2 flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit"
                    style={{
                      background: user.status === "Aktif" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)",
                      color: user.status === "Aktif" ? "#4ade80" : "#f87171",
                      border: `1px solid ${user.status === "Aktif" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.2)"}`,
                    }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />
                    {user.status}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-white/30">{user.role}</span>
                </div>

                {/* Password */}
                <div className="col-span-2">
                  <span className="text-[12px] font-mono" style={{ color: "var(--gold)" }}>{user.password}</span>
                </div>

                {/* Last Login */}
                <div className="col-span-2">
                  <span className="text-[12px] text-white/35">{formatDate(user.last_login)}</span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button onClick={() => handleToggleStatus(user)} title={user.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(197,160,89,0.12)"; e.currentTarget.style.color = "var(--gold)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}>
                    <i className={`fas ${user.status === "Aktif" ? "fa-ban" : "fa-check"}`} style={{ fontSize: "11px" }} />
                  </button>
                  <button onClick={() => handleDelete(user)} title="Hapus akun"
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "rgba(248,113,113,0.5)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#f87171"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.color = "rgba(248,113,113,0.5)"; }}>
                    <i className="fas fa-trash" style={{ fontSize: "11px" }} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* ─── ADD USER MODAL ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" style={{ backdropFilter: "blur(6px)" }}
            onClick={() => setShowModal(false)} />
          <div className="relative rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            style={{ background: "var(--navy)", border: "1px solid rgba(197,160,89,0.2)" }}>
            <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(197,160,89,0.1)" }}>
              <h2 className="text-[16px] font-bold text-white">Tambah Pengguna Baru</h2>
              <p className="text-[12px] text-white/35 mt-0.5">Data akan langsung tersimpan di Google Sheets</p>
            </div>
            <form onSubmit={handleAddUser} className="px-6 py-5 space-y-4">
              {[
                { field: "name", label: "Nama Lengkap", placeholder: "contoh: Budi Santoso", type: "text" },
                { field: "email", label: "Email", placeholder: "contoh: budi@tourleader.id", type: "email" },
                { field: "password", label: "Password", placeholder: "minimal 6 karakter", type: "text" },
              ].map(({ field, label, placeholder, type }) => (
                <div key={field}>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35 mb-1.5">{label}</label>
                  <input type={type} placeholder={placeholder}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-[13px] font-medium text-white outline-none"
                    style={{ background: "rgba(6,15,29,0.7)", border: "1px solid rgba(197,160,89,0.15)" }} />
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35 mb-1.5">Role</label>
                <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-[13px] font-medium text-white outline-none appearance-none"
                  style={{ background: "rgba(6,15,29,0.7)", border: "1px solid rgba(197,160,89,0.15)" }}>
                  <option value="Tour Leader">Tour Leader</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white/50 transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="btn-primary flex-1 py-3 rounded-xl text-[13px] flex items-center justify-center gap-2">
                  {saving ? <><i className="fas fa-circle-notch fa-spin" /> Menyimpan…</> : <><i className="fas fa-plus" /> Tambah</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className="fixed bottom-5 right-5 z-[90] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id}
            className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-xl text-white"
            style={{
              backdropFilter: "blur(12px)",
              background: t.type === "error" ? "rgba(220,38,38,0.92)" : t.type === "info" ? "rgba(17,34,64,0.95)" : "rgba(5,150,105,0.92)",
              border: t.type === "info" ? "1px solid rgba(197,160,89,0.25)" : "none",
            }}>
            <i className={`fas ${t.type === "error" ? "fa-circle-exclamation" : t.type === "info" ? "fa-circle-info" : "fa-circle-check"} opacity-80`} />
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
