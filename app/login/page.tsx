"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorLine, setErrorLine] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorLine("");
    const inputEmail = email.trim().toLowerCase();

    // Validasi dummy khusus admin statis
    if (inputEmail === "admin" && password === "admin123") {
      setLoading(false);
      router.push("/admin");
      return;
    }
    
    try {
      const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .ilike("email", inputEmail)
        .eq("password", password);

      if (error) throw error;

      if (users && users.length > 0) {
        const matchedUser = users[0];
        
        if (matchedUser.status !== "Aktif") {
          setErrorLine("Akun Anda sedang dinonaktifkan oleh Admin.");
        } else {
          // Update lastLogin timestamp asynchronously
          await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", matchedUser.id);
          
          localStorage.setItem('sgm_profile', JSON.stringify({ name: matchedUser.name, email: matchedUser.email }));
          router.push("/dashboard");
        }
      } else {
        setErrorLine("Email/Username atau Password salah. Anda belum terdaftar.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorLine("Terjadi kesalahan koneksi server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 map-grid" aria-hidden="true">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #C5A059 0%, transparent 70%)" }}
        ></div>
        <div
          className="absolute -bottom-48 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #D4B576 0%, transparent 70%)" }}
        ></div>
        <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full border border-gold/[0.06] spin-slow"></div>
        <div
          className="absolute top-1/4 right-[15%] w-20 h-20 rounded-full border border-gold/[0.04] spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "30s" }}
        ></div>
        <div className="absolute top-[18%] left-[12%] w-2 h-2 rounded-full bg-gold/20 float-a"></div>
        <div className="absolute top-[55%] left-[8%] w-1.5 h-1.5 rounded-full bg-gold/15 float-b"></div>
      </div>

      <div className="max-w-md w-full relative z-10 fade-in-up">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-gold-dark items-center justify-center mb-4 shadow-lg shadow-gold/20">
            <i className="fas fa-compass text-navy text-3xl"></i>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            <span className="text-white">Script</span>
            <span className="gold-text">Guiding</span>
          </h1>
          <p className="text-white/50 text-sm">Tour Leader Productivity Tool</p>
        </div>

        {/* Login Card */}
        <div className="bg-navy-light/80 border border-navy-lighter/60 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/30" style={{ backdropFilter: "blur(8px)" }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Masuk ke Akun Anda</h2>
            <p className="text-xs text-gold/80 italic">
              * Dashboard ini ditujukan eksklusif hanya untuk pengguna (Tour Leader) dan Admin yang sudah terdaftar.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {errorLine && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-xs text-center">
                <i className="fas fa-exclamation-triangle mr-2"></i> {errorLine}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Email / Username
              </label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 text-sm"></i>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tourleader.id | admin"
                  className="input-gold w-full pl-11 pr-4 py-3.5 rounded-xl bg-navy-dark/60 border border-navy-lighter/50 text-white placeholder-white/25 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 text-sm"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-gold w-full pl-11 pr-12 py-3.5 rounded-xl bg-navy-dark/60 border border-navy-lighter/50 text-white placeholder-white/25 text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2.5"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <span>Login & Masuk Dashboard</span>
                    <i className="fas fa-arrow-right"></i>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
