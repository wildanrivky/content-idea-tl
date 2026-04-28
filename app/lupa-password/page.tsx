"use client";

import { useState } from "react";
import Link from "next/link";

export default function LupaPasswordPage() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    const message = `Halo, Nama saya ${form.name.trim()} Email ${form.email.trim()} Saya Lupa Password One App Tour Leader saya, boleh di bantu ?`;
    const encodedMessage = encodeURIComponent(message);
    const waNumber = "6281293607105";
    const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;

    setSent(true);
    // Small delay for UX feedback before opening WA
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 600);
  };

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

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px]">

          {/* Back Link */}
          <div className="mb-6 fade-in-up">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-[12px] font-semibold transition-colors"
              style={{ color: "rgba(197,160,89,0.6)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#C5A059"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(197,160,89,0.6)"; }}
            >
              <i className="fas fa-arrow-left" style={{ fontSize: "11px" }} />
              Kembali ke Halaman Login
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8 fade-in-up">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 relative"
              style={{
                background: "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(30,58,138,0.45) 100%)",
                border: "1px solid rgba(34,197,94,0.22)",
                boxShadow: "0 8px 32px rgba(34,197,94,0.12)",
              }}
            >
              <i className="fab fa-whatsapp" style={{ color: "#4ade80", fontSize: "28px" }} />
            </div>
            <h1 className="text-[26px] font-extrabold tracking-tight mb-1">
              <span className="text-white">Lupa </span>
              <span className="gold-text">Password?</span>
            </h1>
            <p className="text-white/45 text-[13px] leading-relaxed">
              Isi form di bawah ini. Kami akan membantu<br />
              Anda via WhatsApp.
            </p>
            <div className="accent-line w-28 mx-auto mt-3" />
          </div>

          {/* Form or Success State */}
          {sent ? (
            /* Success State */
            <div
              className="glass fade-in-up text-center"
              style={{ padding: "36px 28px" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}
              >
                <i className="fab fa-whatsapp text-3xl" style={{ color: "#4ade80" }} />
              </div>
              <h2 className="text-[17px] font-bold text-white mb-2">WhatsApp Sedang Dibuka</h2>
              <p className="text-[13px] text-white/45 leading-relaxed mb-6">
                Pesan sudah terisi otomatis. Tinggal klik <strong className="text-white/70">Kirim</strong> di WhatsApp Anda!
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "" }); }}
                className="text-[12px] font-semibold transition-colors"
                style={{ color: "rgba(197,160,89,0.6)", background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#C5A059"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(197,160,89,0.6)"; }}
              >
                <i className="fas fa-rotate-left mr-1.5" style={{ fontSize: "11px" }} />
                Isi ulang form
              </button>
            </div>
          ) : (
            /* Form */
            <div className="glass fade-in-up-d1" style={{ padding: "28px" }}>
              <div className="mb-5">
                <h2 className="text-[17px] font-bold text-white mb-1">Informasi Akun Anda</h2>
                <p className="text-[12px] leading-relaxed" style={{ color: "rgba(197,160,89,0.75)", fontStyle: "italic" }}>
                  * Isi dengan nama dan email yang terdaftar.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Nama */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>
                    Nama Lengkap
                  </label>
                  <div style={{ position: "relative" }}>
                    <i className="fas fa-user" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(197,160,89,0.5)", fontSize: "13px" }} />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="contoh: Budi Santoso"
                      required
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

                {/* Email */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>
                    Email Terdaftar
                  </label>
                  <div style={{ position: "relative" }}>
                    <i className="fas fa-envelope" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(197,160,89,0.5)", fontSize: "13px" }} />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="contoh: budi@email.com"
                      required
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

                {/* Preview pesan */}
                {(form.name || form.email) && (
                  <div
                    className="rounded-xl p-3.5 fade-in-up"
                    style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
                      Preview Pesan WhatsApp:
                    </p>
                    <p className="text-[12px] text-white/55 leading-relaxed italic">
                      "Halo, Nama saya <strong className="text-white/75 not-italic">{form.name || "…"}</strong> Email <strong className="text-white/75 not-italic">{form.email || "…"}</strong> Saya Lupa Password One App Tour Leader saya, boleh di bantu ?"
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "15px",
                    marginTop: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: "linear-gradient(135deg, #25D366, #128C7E)",
                  }}
                >
                  <i className="fab fa-whatsapp" style={{ fontSize: "18px" }} />
                  Kirim via WhatsApp
                </button>
              </form>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-white/25 text-[11px] mt-6 fade-in-up-d2">
            © {new Date().getFullYear()} One App Tour Leader · All rights reserved
          </p>
        </div>
      </div>
    </>
  );
}
