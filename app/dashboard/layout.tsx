"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

const navItems = [
  { href: "/dashboard", label: "Beranda", icon: "fa-house" },
  { href: "/dashboard/script", label: "Script Guiding", icon: "fa-scroll" },
  { href: "/dashboard/content", label: "Content Idea", icon: "fa-lightbulb" },
  { href: "/dashboard/settings", label: "Pengaturan", icon: "fa-gear" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "var(--navy)" }}>
      {/* BG Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 map-grid" aria-hidden="true">
        <div className="absolute -top-32 right-0 w-[420px] h-[420px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #C5A059 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #D4B576 0%, transparent 70%)" }} />
      </div>

      {/* ─── TOP HEADER ─────────────────────────────────────── */}
      <header
        className="relative z-40 w-full flex-shrink-0"
        style={{
          background: "rgba(6,15,29,0.92)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(197,160,89,0.12)",
          boxShadow: "0 2px 24px rgba(0,0,0,0.25)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgba(197,160,89,0.22), rgba(30,58,138,0.5))",
                border: "1px solid rgba(197,160,89,0.22)",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <div className="text-[13px] font-extrabold leading-tight">
                <span className="text-white">One App </span>
                <span className="gold-text">Tour Leader</span>
              </div>
              <div className="text-[9px] text-white/25 leading-tight tracking-wide">Tour Leader Platform</div>
            </div>
            <div className="sm:hidden">
              <div className="text-[13px] font-extrabold">
                <span className="text-white">One App </span><span className="gold-text">TL</span>
              </div>
            </div>
          </Link>

          {/* ─── DESKTOP NAV ───────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
                style={{
                  color: isActive(item.href) ? "var(--gold-light)" : "rgba(255,255,255,0.45)",
                  background: isActive(item.href) ? "rgba(197,160,89,0.12)" : "transparent",
                  border: isActive(item.href) ? "1px solid rgba(197,160,89,0.2)" : "1px solid transparent",
                }}
                onMouseEnter={e => {
                  if (!isActive(item.href)) {
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.8)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(item.href)) {
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  }
                }}
              >
                <i className={`fas ${item.icon}`} style={{ fontSize: "12px", color: isActive(item.href) ? "var(--gold)" : "inherit" }} />
                {item.label}
                {isActive(item.href) && (
                  <span
                    className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                    style={{ background: "var(--gold)" }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* ─── RIGHT SIDE: User + Logout ─────────────── */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* User badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(197,160,89,0.07)", border: "1px solid rgba(197,160,89,0.12)" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, var(--gold), var(--gold-dark))" }}>
                <i className="fas fa-user" style={{ fontSize: "10px", color: "var(--navy-dark)" }} />
              </div>
              <span className="text-[12px] font-semibold text-white/70">Tour Leader</span>
            </div>

            {/* Logout */}
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all"
                style={{
                  color: "rgba(248,113,113,0.7)",
                  border: "1px solid rgba(239,68,68,0.15)",
                  background: "rgba(239,68,68,0.05)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.12)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(248,113,113,0.7)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.05)";
                }}
              >
                <i className="fas fa-sign-out-alt" style={{ fontSize: "11px" }} />
                Keluar
              </button>
            </form>
          </div>

          {/* ─── MOBILE HAMBURGER ──────────────────────── */}
          <button
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
            style={{
              background: menuOpen ? "rgba(197,160,89,0.12)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${menuOpen ? "rgba(197,160,89,0.25)" : "rgba(255,255,255,0.08)"}`,
              color: menuOpen ? "var(--gold)" : "rgba(255,255,255,0.5)",
            }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          >
            <i className={`fas ${menuOpen ? "fa-xmark" : "fa-bars-staggered"}`} style={{ fontSize: "14px" }} />
          </button>
        </div>

        {/* ─── MOBILE DROPDOWN MENU ──────────────────────── */}
        {menuOpen && (
          <div
            className="md:hidden px-4 pb-3 pt-1"
            style={{ borderTop: "1px solid rgba(197,160,89,0.08)" }}
          >
            <nav className="flex flex-col gap-1 mb-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all"
                  style={{
                    color: isActive(item.href) ? "var(--gold-light)" : "rgba(255,255,255,0.5)",
                    background: isActive(item.href) ? "rgba(197,160,89,0.12)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive(item.href) ? "rgba(197,160,89,0.2)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  <i className={`fas ${item.icon}`}
                    style={{ fontSize: "13px", color: isActive(item.href) ? "var(--gold)" : "inherit", width: 18, textAlign: "center" }} />
                  {item.label}
                  {isActive(item.href) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full pulse-gold flex-shrink-0"
                      style={{ background: "var(--gold)" }} />
                  )}
                </Link>
              ))}
            </nav>

            {/* Mobile user + logout */}
            <div className="flex items-center justify-between pt-2"
              style={{ borderTop: "1px solid rgba(197,160,89,0.08)" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, var(--gold), var(--gold-dark))" }}>
                  <i className="fas fa-user" style={{ fontSize: "10px", color: "var(--navy-dark)" }} />
                </div>
                <span className="text-[12px] font-semibold text-white/55">Tour Leader</span>
              </div>
              <form action={logoutAction}>
                <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold"
                  style={{ color: "#f87171", border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.06)" }}>
                  <i className="fas fa-sign-out-alt" style={{ fontSize: "10px" }} />
                  Keluar
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* ─── MAIN CONTENT ─────────────────────────────────── */}
      <main className="relative z-10 flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
