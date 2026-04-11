"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { logoutAction } from "@/app/actions/auth";

export default function AdminPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPass, setNewUserPass] = useState("");
    const [newUserRole, setNewUserRole] = useState("Tour Leader");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const { data } = await supabase.from("users").select("*").order("id", { ascending: false });
        if (data) setUsers(data);
        setLoading(false);
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const newUser = {
            name: newUserName,
            email: newUserEmail.trim().toLowerCase(),
            password: newUserPass,
            role: newUserRole,
            status: "Aktif",
            last_login: null
        };
        const { error } = await supabase.from("users").insert([newUser]);
        if (!error) {
            setNewUserName(""); setNewUserEmail(""); setNewUserPass(""); setNewUserRole("Tour Leader");
            setIsAddUserOpen(false);
            fetchUsers();
        } else {
            alert("Gagal menambahkan user: " + error.message);
        }
    };

    const toggleUserStatus = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === "Aktif" ? "Tidak Aktif" : "Aktif";
        await supabase.from("users").update({ status: newStatus }).eq("id", id);
        fetchUsers();
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0a1628', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <header style={{ padding: '16px 24px', backgroundColor: 'rgba(15,23,42,0.8)', borderBottom: '1px solid rgba(59,130,246,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Admin Portal</h1>
                </div>
                <form action={logoutAction}>
                    <button type="submit" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
                </form>
            </header>

            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Manajemen Pengguna</h2>
                        <p style={{ color: '#7c8db5', fontSize: '14px', margin: 0 }}>Kelola akses pengguna terdaftar yang diizinkan untuk Content Idea App.</p>
                    </div>
                    <button onClick={() => setIsAddUserOpen(true)} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#0f172a', fontWeight: 'bold', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Tambah User
                    </button>
                </div>

                <div style={{ backgroundColor: 'rgba(15,23,42,0.6)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(59,130,246,0.12)', backgroundColor: 'rgba(10,16,30,0.5)' }}>
                                    <th style={{ padding: '16px 24px', color: '#7c8db5', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pengguna</th>
                                    <th style={{ padding: '16px 24px', color: '#7c8db5', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Akses / Status</th>
                                    <th style={{ padding: '16px 24px', color: '#7c8db5', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</th>
                                    <th style={{ padding: '16px 24px', color: '#7c8db5', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Login Terakhir</th>
                                    <th style={{ padding: '16px 24px', color: '#7c8db5', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#7c8db5' }}>Memuat data...</td></tr>
                                )}
                                {!loading && users.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(59,130,246,0.06)' }}>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontWeight: 'bold', color: '#e2e8f0' }}>{u.name}</div>
                                            <div style={{ fontSize: '12px', color: '#7c8db5', marginTop: '4px' }}>{u.email}</div>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                                                <span style={{ 
                                                    padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold',
                                                    backgroundColor: u.status === 'Aktif' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                                    color: u.status === 'Aktif' ? '#4ade80' : '#f87171',
                                                    border: `1px solid ${u.status === 'Aktif' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`
                                                }}>{u.status}</span>
                                                <span style={{ fontSize: '10px', color: '#7c8db5', backgroundColor: '#0f172a', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>{u.role}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontFamily: 'monospace', color: '#f59e0b', fontSize: '13px' }}>{u.password}</td>
                                        <td style={{ padding: '16px 24px', fontSize: '12px', color: '#7c8db5' }}>{u.last_login ? new Date(u.last_login).toLocaleDateString('id-ID') : 'Belum pernah'}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <button onClick={() => toggleUserStatus(u.id, u.status)} style={{ background: 'none', border: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', cursor: 'pointer', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                                {u.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {isAddUserOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setIsAddUserOpen(false)}></div>
                    <div style={{ position: 'relative', backgroundColor: '#0f172a', border: '1px solid rgba(59,130,246,0.12)', borderRadius: '16px', width: '100%', maxWidth: '400px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Tambah Pengguna</h3>
                            <button onClick={() => setIsAddUserOpen(false)} style={{ background: 'none', border: 'none', color: '#7c8db5', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
                        </div>
                        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#7c8db5', marginBottom: '8px', textTransform: 'uppercase' }}>Nama</label>
                                <input required type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.12)', backgroundColor: 'rgba(15,23,42,0.55)', color: 'white', boxSizing: 'border-box' }}/>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#7c8db5', marginBottom: '8px', textTransform: 'uppercase' }}>Email</label>
                                <input required type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.12)', backgroundColor: 'rgba(15,23,42,0.55)', color: 'white', boxSizing: 'border-box' }}/>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#7c8db5', marginBottom: '8px', textTransform: 'uppercase' }}>Password</label>
                                <input required type="text" value={newUserPass} onChange={e => setNewUserPass(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.12)', backgroundColor: 'rgba(15,23,42,0.55)', color: 'white', boxSizing: 'border-box' }}/>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#7c8db5', marginBottom: '8px', textTransform: 'uppercase' }}>Role</label>
                                <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.12)', backgroundColor: 'rgba(15,23,42,0.55)', color: 'white', boxSizing: 'border-box' }}>
                                    <option value="Tour Leader">Tour Leader</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#0f172a', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '8px' }}>Simpan Pengguna</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
