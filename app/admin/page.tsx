"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [toasts, setToasts] = useState<{ id: number, message: string, type: string }[]>([]);

    // Modal Add User State
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPass, setNewUserPass] = useState("");
    const [newUserRole, setNewUserRole] = useState("Tour Leader");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const { data, error } = await supabase.from("users").select("*").order("id", { ascending: false });
        if (data) {
            setUsers(data);
        } else if (error) {
            showToast("Gagal mengambil data user dari server", "error");
        }
    };

    const showToast = (message: string, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const handleLogout = () => {
        showToast('Keluar dari dashboard admin...', 'info');
        setTimeout(() => router.push('/login'), 800);
    };

    const toggleUserStatus = async (id: number) => {
        const targetUser = users.find(u => u.id === id);
        if (!targetUser) return;
        
        const newStatus = targetUser.status === "Aktif" ? "Tidak Aktif" : "Aktif";
        const { error } = await supabase.from("users").update({ status: newStatus }).eq("id", id);
        
        if (!error) {
            showToast(`Status ${targetUser.name} diubah menjadi ${newStatus}`, newStatus === "Aktif" ? "success" : "info");
            setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
        } else {
            showToast(`Gagal mengubah status: ${error.message}`, "error");
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const newUser = {
            name: newUserName,
            email: newUserEmail.trim().toLowerCase(),
            password: newUserPass,
            role: newUserRole,
            status: "Aktif",
            last_login: new Date().toISOString()
        };
        
        const { error } = await supabase.from("users").insert([newUser]);
        
        if (error) {
            showToast(`Gagal: ${error.message}`, 'error');
            return;
        }

        fetchUsers();

        // Reset form
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPass("");
        setNewUserRole("Tour Leader");
        setIsAddUserOpen(false);
        showToast(`User ${newUser.name} berhasil ditambahkan!`, 'success');
    };

    return (
        <div className="relative min-h-screen z-10 w-full overflow-x-hidden bg-navy">
            {/* Header / Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-navy-lighter/40" style={{ background: 'rgba(10,25,47,0.85)', backdropFilter: 'blur(16px)' }}>
                <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
                            <i className="fas fa-shield-halved text-white text-sm"></i>
                        </div>
                        <span className="text-base font-bold tracking-tight">
                            <span className="text-white">Admin</span><span className="text-red-400">Portal</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white/80 hover:text-white bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/20">
                            <i className="fas fa-sign-out-alt mr-2"></i>Logout
                        </button>
                    </div>
                </nav>
            </header>

            {/* Background Map Grid */}
            <div className="fixed inset-0 pointer-events-none z-0 map-grid" aria-hidden="true">
                <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #EF4444 0%, transparent 70%)" }}></div>
            </div>

            {/* Main Content */}
            <main className="relative z-10 pt-24 pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Manajemen Pengguna Terotorisasi</h1>
                        <p className="text-white/50 text-sm">Kelola akses Tour Leader yang diizinkan untuk menggunakan Script Guiding Maker.</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-navy-light/50 border border-navy-lighter/40 rounded-xl p-5">
                            <div className="flex items-center gap-2.5 mb-2">
                                <i className="fas fa-users text-gold text-sm"></i>
                                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Total Terdaftar</span>
                            </div>
                            <div className="text-3xl font-extrabold text-white">{users.length}</div>
                        </div>
                        <div className="bg-navy-light/50 border border-navy-lighter/40 rounded-xl p-5">
                            <div className="flex items-center gap-2.5 mb-2">
                                <i className="fas fa-user-check text-emerald-400 text-sm"></i>
                                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Status Aktif</span>
                            </div>
                            <div className="text-3xl font-extrabold text-white">{users.filter(u => u.status === "Aktif").length}</div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-navy-light/80 border border-navy-lighter/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/30" style={{ backdropFilter: "blur(8px)" }}>
                        <div className="p-5 border-b border-navy-lighter/30 flex justify-between items-center bg-navy-dark/40">
                            <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">Daftar Pengguna</h3>
                            <button onClick={() => setIsAddUserOpen(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-navy bg-gradient-to-r from-gold to-gold-light hover:shadow-lg hover:shadow-gold/25 transition-all">
                                <i className="fas fa-plus mr-1.5"></i>Tambah
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-navy-lighter/20 text-left text-xs text-white/30 uppercase tracking-wider">
                                        <th className="px-6 py-4 font-semibold">Pengguna</th>
                                        <th className="px-6 py-4 font-semibold">Akses / Status</th>
                                        <th className="px-6 py-4 font-semibold">Password</th>
                                        <th className="px-6 py-4 font-semibold">Login Terakhir</th>
                                        <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} className="border-b border-navy-lighter/15 hover:bg-navy-lighter/10 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white/90">{u.name}</div>
                                                <div className="text-xs text-white/40 mt-0.5">{u.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${u.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Aktif' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gold/80 font-mono text-xs">
                                                {u.password || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-white/40 text-xs">
                                                {u.last_login ? new Date(u.last_login).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Belum Pernah"}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => toggleUserStatus(u.id)} className="text-white/30 hover:text-white transition-colors" title={u.status === "Aktif" ? "Nonaktifkan Akses" : "Aktifkan Akses"}>
                                                    <i className={`fas ${u.status === "Aktif" ? "fa-ban hover:text-red-400" : "fa-check hover:text-emerald-400"}`}></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal Tambah Pengguna */}
            {isAddUserOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60" style={{ backdropFilter: 'blur(6px)' }} onClick={() => setIsAddUserOpen(false)}></div>
                    <div className="modal-enter relative bg-navy-light border border-navy-lighter/60 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col pt-6 pb-6 px-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">Tambah Pengguna Baru</h3>
                            <button onClick={() => setIsAddUserOpen(false)} className="w-8 h-8 rounded-lg hover:bg-navy-lighter/40 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                                <i className="fas fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Nama Pengguna</label>
                                <div className="relative">
                                    <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 text-sm"></i>
                                    <input type="text" required value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Contoh: Wildan Rivky" className="input-gold w-full pl-11 pr-4 py-3 rounded-xl bg-navy-dark/60 border border-navy-lighter/50 text-white text-sm font-medium" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Email</label>
                                <div className="relative">
                                    <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 text-sm"></i>
                                    <input type="email" required value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="email@tourleader.id" className="input-gold w-full pl-11 pr-4 py-3 rounded-xl bg-navy-dark/40 border border-navy-lighter/50 text-white text-sm font-medium" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Password Sementara</label>
                                <div className="relative">
                                    <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 text-sm"></i>
                                    <input type="text" required value={newUserPass} onChange={(e) => setNewUserPass(e.target.value)} placeholder="Contoh: default123" className="input-gold w-full pl-11 pr-4 py-3 rounded-xl bg-navy-dark/60 border border-navy-lighter/50 text-white text-sm font-medium" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Role</label>
                                <div className="relative">
                                    <i className="fas fa-briefcase absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 text-sm"></i>
                                    <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="input-gold w-full pl-11 pr-4 py-3 rounded-xl bg-navy-dark/60 border border-navy-lighter/50 text-white text-sm font-medium appearance-none">
                                        <option value="Tour Leader">Tour Leader</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="btn-primary w-full py-3 rounded-xl text-sm font-bold shadow-lg">Simpan & Beri Akses</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast Container */}
            <div className="fixed bottom-5 right-5 z-[90] flex flex-col gap-2.5 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${t.type === 'error' ? 'bg-red-600/90 text-white' : t.type === 'info' ? 'bg-navy-light border border-navy-lighter/50 text-white' : 'bg-emerald-600/90 text-white'}`} style={{ backdropFilter: 'blur(12px)', animation: 'fadeInUp 0.3s ease' }}>
                        <i className={`fas ${t.type === 'error' ? 'fa-circle-exclamation' : t.type === 'info' ? 'fa-circle-info' : 'fa-circle-check'} text-base opacity-80`}></i>
                        <span>{t.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
