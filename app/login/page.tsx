"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* Animated Background */}
      <div className="bg-scene" aria-hidden="true" />
      <div className="orb orb-a" aria-hidden="true" />
      <div className="orb orb-b" aria-hidden="true" />
      <div className="orb orb-c" aria-hidden="true" />

      {/* Grid Pattern */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(197,160,89,.028) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,.028) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Floating Dots */}
      {[
        { size: 3, color: "rgba(197,160,89,.32)", top: "12%", left: "18%", delay: "0s" },
        { size: 2, color: "rgba(59,130,246,.35)", top: "26%", left: "76%", delay: "-4s" },
        { size: 4, color: "rgba(197,160,89,.18)", top: "44%", left: "8%", delay: "-9s" },
        { size: 2, color: "rgba(96,165,250,.28)", top: "60%", left: "88%", delay: "-2s" },
        { size: 3, color: "rgba(197,160,89,.22)", top: "78%", left: "36%", delay: "-13s" },
      ].map((dot, i) => (
        <div
          key={i}
          className="dot-float fixed rounded-full pointer-events-none"
          style={{
            width: dot.size, height: dot.size,
            background: dot.color,
            top: dot.top, left: dot.left,
            animationDelay: dot.delay,
            zIndex: 1,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Main Content */}
      <div
        className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8"
      >
        <div className="w-full max-w-[400px]">

          {/* Header */}
          <div className="text-center mb-8 fade-in-up">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 relative"
              style={{
                background: "linear-gradient(135deg, rgba(197,160,89,0.2) 0%, rgba(30,58,138,0.45) 100%)",
                border: "1px solid rgba(197,160,89,0.22)",
                boxShadow: "0 8px 32px rgba(197,160,89,0.12)",
              }}
            >
              <div className="compass-spin">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
            </div>

            {/* App Name */}
            <h1 className="text-[28px] font-extrabold tracking-tight mb-1">
              <span className="text-white">One App </span>
              <span className="gold-text">Tour Leader</span>
            </h1>
            <p className="text-white/45 text-[13px]">One-Stop Solution Platform for Tour Leaders</p>
            <div className="accent-line w-28 mx-auto mt-3" />
          </div>

          {/* Login Card */}
          <div className="glass fade-in-up-d1" style={{ padding: "28px" }}>
            <div className="mb-5">
              <h2 className="text-[17px] font-bold text-white mb-1">Masuk ke Dashboard</h2>
              <p className="text-[12px] leading-relaxed" style={{ color: "rgba(197,160,89,0.75)", fontStyle: "italic" }}>
                * Eksklusif untuk Tour Leader & Admin yang terdaftar.
              </p>
            </div>

            <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Error Alert */}
              {state?.error && (
                <div className="fade-in-up" style={{
                  padding: "11px 14px",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.28)",
                  borderRadius: "10px",
                  color: "#fca5a5",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <i className="fas fa-circle-exclamation text-red-400" style={{ flexShrink: 0 }} />
                  {state.error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>
                  Email / Username
                </label>
                <div style={{ position: "relative" }}>
                  <i className="fas fa-envelope" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(197,160,89,0.5)", fontSize: "13px" }} />
                  <input
                    type="text"
                    name="email"
                    placeholder="email@tourleader.id atau admin"
                    required
                    autoComplete="username"
                    className="input-gold"
                    style={{
                      width: "100%",
                      padding: "13px 14px 13px 40px",
                      borderRadius: "12px",
                      background: "rgba(6,15,29,0.6)",
                      border: "1px solid rgba(197,160,89,0.15)",
                      color: "white",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <i className="fas fa-lock" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(197,160,89,0.5)", fontSize: "13px" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••••"
                    required
                    autoComplete="current-password"
                    className="input-gold"
                    style={{
                      width: "100%",
                      padding: "13px 44px 13px 40px",
                      borderRadius: "12px",
                      background: "rgba(6,15,29,0.6)",
                      border: "1px solid rgba(197,160,89,0.15)",
                      color: "white",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    style={{
                      position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", color: "rgba(255,255,255,0.35)",
                      cursor: "pointer", padding: "4px", transition: "color 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} style={{ fontSize: "14px" }} />
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: isPending ? "not-allowed" : "pointer",
                  fontSize: "15px",
                  marginTop: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin" style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <i className="fas fa-arrow-right" style={{ fontSize: "13px" }} />
                  </>
                )}
              </button>

              {/* Lupa Password */}
              <div style={{ textAlign: "center", marginTop: "4px" }}>
                <a
                  href="/lupa-password"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "rgba(197,160,89,0.55)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#C5A059"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(197,160,89,0.55)"; }}
                >
                  <i className="fas fa-circle-question" style={{ marginRight: "5px", fontSize: "11px" }} />
                  Lupa Password?
                </a>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-white/25 text-[11px] mt-6 fade-in-up-d2">
            © {new Date().getFullYear()} One App Tour Leader · All rights reserved
          </p>
        </div>
      </div>
    </>
  );
}
