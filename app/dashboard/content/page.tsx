"use client";

import { useState } from "react";

// ─── DATA (selaras dengan my-idea-app) ─────────────────
const TRIP_TYPES = [
  { value: "Sendiri",     label: "Sendiri",     icon: "fa-person",   desc: "Solo travel, pengalaman pribadi" },
  { value: "Bareng Grup", label: "Bareng Grup", icon: "fa-users",    desc: "Rombongan wisata group" },
  { value: "Pasangan",    label: "Pasangan",    icon: "fa-heart",    desc: "Honeymoon atau couple trip" },
  { value: "Solo Trip",   label: "Solo Trip",   icon: "fa-compass",  desc: "Perjalanan mandiri & bebas" },
];

const MOODS = [
  { value: "Edukatif",        label: "Edukatif",        icon: "fa-book-open",  color: "#60a5fa", desc: "Fakta & wawasan destinasi" },
  { value: "Lucu",            label: "Lucu",            icon: "fa-face-smile", color: "#facc15", desc: "Humor & entertaining" },
  { value: "Aesthetic",       label: "Aesthetic",       icon: "fa-camera",     color: "#f472b6", desc: "Visual menarik & cinematic" },
  { value: "POV Tour Leader", label: "POV Tour Leader", icon: "fa-eye",        color: "#a78bfa", desc: "Sudut pandang Tour Leader" },
];

const JUMLAH_OPTIONS = ["3", "5", "7"];

type HistoryEntry = {
  id: number;
  location: string;
  tripType: string;
  mood: string;
  jumlah: string;
  prompt: string;
  timestamp: string;
  type: "content";
};

// ─── BUILD PROMPT (sesuai my-idea-app) ────────────────
function buildPrompt(location: string, tripType: string, mood: string, jumlah: string): string {
  return [
    "Bertindaklah sebagai Professional Travel Content Strategist khusus industri pariwisata Indonesia.",
    "",
    "Saya adalah seorang Tour Leader yang sedang berada di " + location + ".",
    "Perjalanan ini untuk tipe: \"" + tripType + "\".",
    "Mood / tone konten yang diinginkan: \"" + mood + "\".",
    "",
    "Tolong buatkan " + jumlah + " ide konten yang siap diproduksi untuk media sosial (Instagram Reels / TikTok / Caption).",
    "",
    "Untuk SETIAP ide, berikan dengan format yang jelas:",
    "",
    "═══════════════════════════════",
    "💡 IDE #[NOMOR]: [JUDUL KONTEN YANG CATCHY]",
    "═══════════════════════════════",
    "",
    "🎣 HOOK (3 detik pertama yang mematikan):",
    "[Kalimat/narasi pembuka yang langsung menarik perhatian dan membuat orang berhenti scroll]",
    "",
    "📝 SCRIPT NARASI SINGKAT:",
    "[Script narasi lengkap yang bisa langsung dibacakan, sesuai tone \"" + mood + "\"]",
    "",
    "🎬 PANDUAN VISUAL / STORYBOARD:",
    "• Shot 1: [Deskripsi visual & angle kamera]",
    "• Shot 2: [Deskripsi visual & angle kamera]",
    "• Shot 3: [Deskripsi visual & angle kamera]",
    "[Tambahkan shot sesuai kebutuhan]",
    "",
    "✍️ CAPTION MEDIA SOSIAL:",
    "[Caption lengkap yang memicu interaksi, emoji relevan, dan CTA yang kuat]",
    "",
    "#️⃣ HASHTAG:",
    "[15-20 hashtag relevan: campuran lokal, niche, dan trending]",
    "",
    "─────────────────────────────── (pisah ke ide berikutnya)",
    "",
    "CATATAN PENTING:",
    "• Semua konten harus dalam BAHASA INDONESIA yang natural dan conversational",
    "• Hook harus spesifik ke " + location + " — bukan generik",
    "• Sesuaikan setiap ide dengan tipe trip \"" + tripType + "\" dan mood \"" + mood + "\"",
    "• Prioritaskan ide yang authentik dan relate dengan kehidupan nyata Tour Leader",
    "• Setiap ide harus memiliki sudut pandang & angle yang BERBEDA satu sama lain",
  ].join("\n");
}

// ─── COMPONENT ─────────────────────────────────────────
export default function ContentIdeaPage() {
  const [location, setLocation] = useState("");
  const [selectedTripType, setSelectedTripType] = useState(TRIP_TYPES[1].value); // Bareng Grup default
  const [selectedMood, setSelectedMood] = useState(MOODS[0].value); // Edukatif default
  const [jumlah, setJumlah] = useState("3");
  const [isLoading, setIsLoading] = useState(false);
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: string }[]>([]);

  const showToast = (msg: string, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  const handleGenerate = () => {
    if (!location.trim()) {
      showToast("Masukkan nama destinasi terlebih dahulu", "error");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const prompt = buildPrompt(location.trim(), selectedTripType, selectedMood, jumlah);
      setLastPrompt(prompt);

      // Save to history
      const entry: HistoryEntry = {
        id: Date.now(),
        location: location.trim(),
        tripType: selectedTripType,
        mood: selectedMood,
        jumlah,
        prompt,
        timestamp: new Date().toISOString(),
        type: "content",
      };
      const prev = JSON.parse(localStorage.getItem("oatl_history") || "[]");
      localStorage.setItem("oatl_history", JSON.stringify([entry, ...prev].slice(0, 50)));

      setIsLoading(false);
      setPromptModalOpen(true);
    }, 800);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(lastPrompt).then(() => {
      setCopied(true);
      showToast("Prompt disalin ke clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openChatGPT = () => {
    window.open(`https://chatgpt.com/?q=${encodeURIComponent(lastPrompt)}`, "_blank", "noopener,noreferrer");
    showToast("ChatGPT dibuka di tab baru!", "success");
  };

  const moodObj = MOODS.find((m) => m.value === selectedMood);

  return (
    <div className="min-h-screen p-5 sm:p-8">
      {/* Page Header */}
      <div className="fade-in-up mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <i className="fas fa-lightbulb" style={{ color: "#f59e0b", fontSize: "15px" }} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Content Idea Tour Leader</h1>
            <p className="text-white/40 text-[13px]">Isi detail trip kamu, langsung dapatkan ide konten dari ChatGPT</p>
          </div>
        </div>
      </div>

      <div className="max-w-xl">
        {/* ─── FORM CARD ─── */}
        <div className="fade-in-up-d1 rounded-2xl p-5 sm:p-7 mb-5"
          style={{ background: "rgba(17,34,64,0.7)", border: "1px solid rgba(245,158,11,0.13)", backdropFilter: "blur(8px)" }}>

          {/* Destinasi */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35 mb-2">
              <i className="fas fa-map-pin mr-1.5" style={{ color: "rgba(245,158,11,0.6)" }} />
              Destinasi
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && location.trim()) handleGenerate(); }}
              placeholder="Contoh: Labuan Bajo, Nusa Tenggara Timur"
              maxLength={120}
              className="input-gold w-full py-3.5 px-4 rounded-xl text-sm font-medium text-white placeholder-white/25"
              style={{ background: "rgba(6,15,29,0.65)", border: "1px solid rgba(245,158,11,0.18)" }}
            />
            <p className="text-[11px] text-white/20 mt-1.5 ml-1">
              Tekan Enter atau klik tombol Generate
            </p>
          </div>

          {/* Tipe Trip */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35 mb-2">
              <i className="fas fa-users mr-1.5" style={{ color: "rgba(245,158,11,0.6)" }} />
              Tipe Trip
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TRIP_TYPES.map((t) => {
                const active = selectedTripType === t.value;
                return (
                  <button key={t.value} type="button"
                    onClick={() => setSelectedTripType(t.value)}
                    className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-[13px] font-semibold text-left transition-all"
                    style={{
                      border: active ? "1px solid rgba(245,158,11,0.45)" : "1px solid rgba(255,255,255,0.07)",
                      background: active ? "rgba(245,158,11,0.12)" : "rgba(17,34,64,0.4)",
                      color: active ? "#fbbf24" : "rgba(255,255,255,0.4)",
                    }}>
                    <i className={`fas ${t.icon} flex-shrink-0`}
                      style={{ color: active ? "#f59e0b" : "rgba(255,255,255,0.25)", fontSize: "14px" }} />
                    <div className="min-w-0">
                      <div className="font-bold truncate">{t.label}</div>
                      <div className="text-[10px] opacity-60 truncate">{t.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mood / Tone */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35 mb-2">
              <i className="fas fa-wand-magic-sparkles mr-1.5" style={{ color: "rgba(245,158,11,0.6)" }} />
              Tone / Mood Konten
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MOODS.map((m) => {
                const active = selectedMood === m.value;
                return (
                  <button key={m.value} type="button"
                    onClick={() => setSelectedMood(m.value)}
                    className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-[13px] font-semibold text-left transition-all"
                    style={{
                      border: active ? `1px solid ${m.color}50` : "1px solid rgba(255,255,255,0.07)",
                      background: active ? `${m.color}14` : "rgba(17,34,64,0.4)",
                      color: active ? m.color : "rgba(255,255,255,0.4)",
                    }}>
                    <i className={`fas ${m.icon} flex-shrink-0`}
                      style={{ color: active ? m.color : "rgba(255,255,255,0.25)", fontSize: "14px" }} />
                    <div className="min-w-0">
                      <div className="font-bold truncate">{m.label}</div>
                      <div className="text-[10px] opacity-60 truncate">{m.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Jumlah Ide */}
          <div className="mb-6">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35 mb-2">
              <i className="fas fa-list-ol mr-1.5" style={{ color: "rgba(245,158,11,0.6)" }} />
              Jumlah Ide Konten
            </label>
            <div className="flex gap-2">
              {JUMLAH_OPTIONS.map((n) => (
                <button key={n} type="button"
                  onClick={() => setJumlah(n)}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all"
                  style={{
                    border: jumlah === n ? "1px solid rgba(245,158,11,0.45)" : "1px solid rgba(255,255,255,0.08)",
                    background: jumlah === n ? "rgba(245,158,11,0.13)" : "rgba(17,34,64,0.4)",
                    color: jumlah === n ? "#fbbf24" : "rgba(255,255,255,0.35)",
                  }}>
                  {n} Ide
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !location.trim()}
            className="btn-primary w-full py-4 rounded-xl text-[15px] flex items-center justify-center gap-2.5"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin" style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Menyusun Ide...
              </>
            ) : (
              <>
                <i className="fas fa-wand-magic-sparkles" />
                Generate {jumlah} Ide on ChatGPT
                <i className="fas fa-arrow-right" style={{ fontSize: "13px" }} />
              </>
            )}
          </button>
        </div>

        {/* Konfigurasi aktif */}
        {location.trim() && (
          <div className="fade-in-up rounded-xl px-4 py-3 mb-4 flex flex-wrap items-center gap-2"
            style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)" }}>
            <i className="fas fa-circle-info text-amber-400/60" style={{ fontSize: "11px" }} />
            <span className="text-[12px] text-white/40">Preview:</span>
            <span className="text-[12px] font-semibold text-amber-300/80">{location}</span>
            <span className="text-white/20 text-[11px]">·</span>
            <span className="text-[12px] text-white/40">{selectedTripType}</span>
            <span className="text-white/20 text-[11px]">·</span>
            <span className="text-[12px]" style={{ color: moodObj?.color ?? "#f59e0b" }}>{selectedMood}</span>
          </div>
        )}

        {/* Tips */}
        <div className="fade-in-up-d2 rounded-2xl p-5"
          style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)" }}>
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-circle-info" style={{ color: "#f59e0b", fontSize: "13px" }} />
            <span className="text-[12px] font-bold text-amber-300/80">Tips Penggunaan</span>
          </div>
          <ul className="space-y-1.5">
            {[
              "Semakin spesifik lokasi, semakin relevan ide yang dihasilkan (contoh: \"Pantai Pink, Labuan Bajo\")",
              "Pilih Tipe Trip yang sesuai dengan rombongan yang sedang kamu pandu",
              "Ganti Mood untuk mendapatkan variasi sudut pandang yang berbeda",
              "Prompt otomatis terbuka di ChatGPT — langsung generate tanpa butuh API",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-white/35">
                <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5"
                  style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b" }}>{i + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── PROMPT MODAL ─── */}
      {promptModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/65" style={{ backdropFilter: "blur(6px)" }}
            onClick={() => setPromptModalOpen(false)} />
          <div className="modal-enter relative rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            style={{ background: "#F5F2ED" }}>

            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between flex-shrink-0"
              style={{ background: "#F5F2ED", borderBottom: "1px solid #E8E2D8" }}>
              <div>
                <h3 className="text-[15px] font-bold" style={{ color: "#0A192F" }}>Prompt Content Idea Siap! 🎉</h3>
                <p className="text-[12px] mt-0.5" style={{ color: "rgba(10,25,47,0.5)" }}>
                  <strong>{location}</strong> · {selectedTripType} · {selectedMood} · {jumlah} Ide
                </p>
              </div>
              <button onClick={() => setPromptModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: "rgba(10,25,47,0.4)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(10,25,47,0.06)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <i className="fas fa-xmark" />
              </button>
            </div>

            {/* Prompt Text */}
            <div className="flex-1 overflow-y-auto px-6 py-5 bg-white min-h-0">
              <pre className="text-[13px] leading-relaxed whitespace-pre-wrap font-sans"
                style={{ color: "rgba(10,25,47,0.8)" }}>
                {lastPrompt}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 flex flex-col sm:flex-row gap-3 flex-shrink-0"
              style={{ background: "#F5F2ED", borderTop: "1px solid #E8E2D8" }}>
              <button onClick={openChatGPT}
                className="btn-primary flex-1 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">
                <i className="fas fa-robot" />
                Generate on ChatGPT
                <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: "11px" }} />
              </button>
              <button onClick={copyPrompt}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  border: `2px solid ${copied ? "rgba(245,158,11,0.6)" : "rgba(10,25,47,0.2)"}`,
                  color: copied ? "#d97706" : "rgba(10,25,47,0.6)",
                  background: copied ? "rgba(245,158,11,0.08)" : "transparent",
                }}>
                <i className={`fas ${copied ? "fa-check" : "fa-copy"}`} />
                {copied ? "Tersalin!" : "Salin Prompt"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST ─── */}
      <div className="fixed bottom-5 right-5 z-[90] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id}
            className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-xl text-white"
            style={{
              background: t.type === "error" ? "rgba(220,38,38,0.92)"
                : t.type === "info" ? "rgba(17,34,64,0.95)"
                : "rgba(5,150,105,0.92)",
              border: t.type === "info" ? "1px solid rgba(197,160,89,0.25)" : "none",
              backdropFilter: "blur(12px)",
              animation: "fadeInUp 0.3s ease",
            }}>
            <i className={`fas ${t.type === "error" ? "fa-circle-exclamation"
              : t.type === "info" ? "fa-circle-info" : "fa-circle-check"} opacity-80`} />
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
