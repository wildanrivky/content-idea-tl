"use client";

import { useState } from "react";
import { changePasswordAction } from "@/app/actions/admin";

export default function SettingsPage() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      showToast("Semua field wajib diisi.", "error"); return;
    }
    if (form.newPassword.length < 6) {
      showToast("Password baru minimal 6 karakter.", "error"); return;
    }
    if (form.newPassword !== form.confirmPassword) {
      showToast("Password baru dan konfirmasi tidak cocok.", "error"); return;
    }
    if (form.oldPassword === form.newPassword) {
      showToast("Password baru tidak boleh sama dengan password lama.", "error"); return;
    }

    setSaving(true);
    const res = await changePasswordAction(form.oldPassword, form.newPassword);
    setSaving(false);

    if (!res.success) {
      showToast(res.error || "Gagal mengganti password.", "error"); return;
    }

    showToast("Password berhasil diubah! 🎉", "success");
    setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const fields = [
    { key: "oldPassword", label: "Password Lama", show: showOld, toggle: () => setShowOld(v => !v), icon: "fa-lock" },
    { key: "newPassword", label: "Password Baru", show: showNew, toggle: () => setShowNew(v => !v), icon: "fa-lock-open" },
    { key: "confirmPassword", label: "Konfirmasi Password Baru", show: showConfirm, toggle: () => setShowConfirm(v => !v), icon: "fa-shield-check" },
  ];

  return (
    <div className="min-h-[80vh] p-5 sm:p-8 flex items-start justify-center">
      <div className="w-full max-w-md">

        {/* Page Title */}
        <div className="mb-7 fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
            style={{ background: "rgba(197,160,89,0.1)", border: "1px solid rgba(197,160,89,0.2)" }}>
            <i className="fas fa-gear" style={{ color: "#C5A059", fontSize: "11px" }} />
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#D4B576" }}>
              Pengaturan Akun
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1.5">Ganti Password</h1>
          <p className="text-white/40 text-sm">Perbarui password akun Anda untuk keamanan yang lebih baik.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 sm:p-7 fade-in-up-d1"
          style={{
            background: "linear-gradient(135deg, rgba(17,34,64,0.95) 0%, rgba(10,20,40,0.9) 100%)",
            border: "1px solid rgba(197,160,89,0.15)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
          }}>

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(({ key, label, show, toggle, icon }) => (
              <div key={key}>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35 mb-2">
                  {label}
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <i className={`fas ${icon}`} style={{ color: "rgba(197,160,89,0.5)", fontSize: "13px" }} />
                  </div>
                  <input
                    type={show ? "text" : "password"}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-xl text-[14px] font-medium text-white outline-none transition-all"
                    style={{
                      background: "rgba(6,15,29,0.6)",
                      border: "1px solid rgba(197,160,89,0.15)",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(197,160,89,0.4)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(197,160,89,0.15)"; }}
                  />
                  <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 transition-colors"
                    style={{ color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
                  >
                    <i className={`fas ${show ? "fa-eye-slash" : "fa-eye"}`} style={{ fontSize: "13px" }} />
                  </button>
                </div>
              </div>
            ))}

            {/* Password requirements */}
            <div className="rounded-xl px-4 py-3" style={{ background: "rgba(197,160,89,0.05)", border: "1px solid rgba(197,160,89,0.1)" }}>
              <p className="text-[11px] text-white/30 flex items-center gap-2">
                <i className="fas fa-circle-info" style={{ color: "rgba(197,160,89,0.5)", fontSize: "11px" }} />
                Password baru minimal 6 karakter dan tidak boleh sama dengan password lama.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full py-3.5 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 mt-2"
              style={{ cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
            >
              {saving ? (
                <><i className="fas fa-circle-notch fa-spin" style={{ fontSize: "13px" }} /> Menyimpan…</>
              ) : (
                <><i className="fas fa-key" style={{ fontSize: "13px" }} /> Simpan Password Baru</>
              )}
            </button>
          </form>
        </div>

        {/* Security Note */}
        <p className="text-center text-white/20 text-[11px] mt-5">
          <i className="fas fa-shield-halved mr-1.5" />
          Password Anda disimpan secara terenkripsi dan aman.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 z-[90] flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-xl text-white"
          style={{
            backdropFilter: "blur(12px)",
            background: toast.type === "error" ? "rgba(220,38,38,0.92)" : "rgba(5,150,105,0.92)",
            border: "none",
            animation: "fadeInUp 0.3s ease",
          }}
        >
          <i className={`fas ${toast.type === "error" ? "fa-circle-exclamation" : "fa-circle-check"} opacity-80`} />
          {toast.msg}
        </div>
      )}
    </div>
  );
}
