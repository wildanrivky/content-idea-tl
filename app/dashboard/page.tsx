"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type HistoryEntry = {
  id: number;
  destination: string;
  tone: string;
  template: string;
  timestamp: string;
  type: "script" | "content";
};

const quickActions = [
  {
    href: "/dashboard/script",
    icon: "fa-scroll",
    label: "Script Guiding",
    desc: "Buat narasi guiding profesional untuk destinasi manapun",
    color: "rgba(197,160,89,0.15)",
    borderColor: "rgba(197,160,89,0.25)",
    iconColor: "#C5A059",
  },
  {
    href: "/dashboard/content",
    icon: "fa-lightbulb",
    label: "Content Idea",
    desc: "Generate ide konten media sosial untuk Tour Leader",
    color: "rgba(59,130,246,0.1)",
    borderColor: "rgba(59,130,246,0.2)",
    iconColor: "#60a5fa",
  },
];

export default function DashboardHome() {
  const [userName, setUserName] = useState("Tour Leader");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [totalScript, setTotalScript] = useState(0);
  const [totalContent, setTotalContent] = useState(0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 18 ? "Selamat Siang" : "Selamat Malam";

  useEffect(() => {
    try {
      const stored = localStorage.getItem("oatl_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setUserName(parsed.name);
      }
      const h = JSON.parse(localStorage.getItem("oatl_history") || "[]") as HistoryEntry[];
      setHistory(h.slice(0, 8));
      setTotalScript(h.filter((x) => x.type === "script").length);
      setTotalContent(h.filter((x) => x.type === "content").length);
    } catch {}
  }, []);

  const stats = [
    { icon: "fa-scroll", label: "Script Dibuat", value: totalScript, color: "#C5A059" },
    { icon: "fa-lightbulb", label: "Ide Konten", value: totalContent, color: "#60a5fa" },
    { icon: "fa-clock-rotate-left", label: "Total Aktivitas", value: totalScript + totalContent, color: "#a78bfa" },
  ];

  return (
    <div className="min-h-screen p-5 sm:p-8">
      {/* Welcome Banner */}
      <div className="fade-in-up mb-8 rounded-2xl p-6 sm:p-7 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(17,34,64,0.95) 0%, rgba(29,52,97,0.8) 100%)",
          border: "1px solid rgba(197,160,89,0.18)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
        }}>
        {/* BG Ornament */}
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #C5A059 0%, transparent 70%)", transform: "translate(30%,-30%)" }} />
        <div className="absolute right-6 bottom-2 opacity-5">
          <i className="fas fa-compass" style={{ fontSize: "80px", color: "#C5A059" }} />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
            style={{ background: "rgba(197,160,89,0.12)", border: "1px solid rgba(197,160,89,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full pulse-gold" style={{ background: "#C5A059" }} />
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#D4B576" }}>Tour Leader Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1.5">
            {greeting}, <span className="gold-text">{userName}!</span>
          </h1>
          <p className="text-white/45 text-sm max-w-md">
            Selamat datang di One App Tour Leader. Pilih tools di bawah ini untuk mulai bekerja.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="fade-in-up-d1 grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card text-center">
            <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center"
              style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}28` }}>
              <i className={`fas ${stat.icon}`} style={{ color: stat.color, fontSize: "15px" }} />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mb-0.5">{stat.value}</div>
            <div className="text-[11px] text-white/35 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="fade-in-up-d2 mb-8">
        <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/30 mb-4">Tools Tersedia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}
              className="card-lift group block rounded-2xl p-5 sm:p-6 relative overflow-hidden"
              style={{ background: action.color, border: `1px solid ${action.borderColor}` }}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${action.iconColor}15`, border: `1px solid ${action.iconColor}25` }}>
                  <i className={`fas ${action.icon}`} style={{ color: action.iconColor, fontSize: "18px" }} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white text-[15px] mb-1 group-hover:text-gold-light transition-colors">
                    {action.label}
                  </div>
                  <p className="text-[13px] text-white/45 leading-relaxed">{action.desc}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: action.iconColor }}>
                <span>Buka Tool</span>
                <i className="fas fa-arrow-right" style={{ fontSize: "10px" }} />
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity">
                <i className={`fas ${action.icon}`} style={{ fontSize: "70px", color: action.iconColor }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="fade-in-up-d3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/30">Aktivitas Terakhir</h2>
          {history.length > 0 && (
            <button onClick={() => { localStorage.removeItem("oatl_history"); setHistory([]); setTotalScript(0); setTotalContent(0); }}
              className="text-[11px] text-red-400/50 hover:text-red-400 transition-colors font-medium">
              Hapus Semua
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: "rgba(17,34,64,0.4)", border: "1px solid rgba(197,160,89,0.08)" }}>
            <i className="fas fa-clock-rotate-left text-white/10 mb-3" style={{ fontSize: "36px" }} />
            <p className="text-white/25 text-sm">Belum ada aktivitas. Mulai gunakan tools di atas!</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(17,34,64,0.6)", border: "1px solid rgba(197,160,89,0.1)" }}>
            {history.map((h, i) => (
              <div key={h.id} className={`flex items-center gap-3 px-4 sm:px-5 py-3.5 ${i < history.length - 1 ? "border-b" : ""} transition-colors hover:bg-white/[0.02]`}
                style={{ borderColor: "rgba(197,160,89,0.07)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: h.type === "script" ? "rgba(197,160,89,0.12)" : "rgba(59,130,246,0.12)" }}>
                  <i className={`fas ${h.type === "script" ? "fa-scroll" : "fa-lightbulb"}`}
                    style={{ color: h.type === "script" ? "#C5A059" : "#60a5fa", fontSize: "12px" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-white/80 truncate">{h.destination}</div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                      style={{ background: h.type === "script" ? "rgba(197,160,89,0.1)" : "rgba(59,130,246,0.1)", color: h.type === "script" ? "#C5A059" : "#60a5fa" }}>
                      {h.type === "script" ? "Script" : "Content"}
                    </span>
                    <span className="text-[10px] text-white/30">{h.tone}</span>
                  </div>
                </div>
                <div className="text-[11px] text-white/20 flex-shrink-0 hidden sm:block">
                  {new Date(h.timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
