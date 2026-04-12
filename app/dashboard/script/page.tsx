"use client";

import { useState, useRef } from "react";

// ─── DATA ──────────────────────────────────────────────
const destinationsDB = [
  { id: 1, name: "Tokyo, Jepang", region: "Asia Timur", thumb: "https://picsum.photos/seed/tokyo22/200/150.jpg" },
  { id: 2, name: "Paris, Prancis", region: "Eropa", thumb: "https://picsum.photos/seed/paris44/200/150.jpg" },
  { id: 3, name: "Bali, Indonesia", region: "Asia Tenggara", thumb: "https://picsum.photos/seed/bali33/200/150.jpg" },
  { id: 4, name: "Istanbul, Turki", region: "Eurasia", thumb: "https://picsum.photos/seed/istanbul11/200/150.jpg" },
  { id: 5, name: "Dubai, UAE", region: "Timur Tengah", thumb: "https://picsum.photos/seed/dubai55/200/150.jpg" },
  { id: 6, name: "Seoul, Korea Selatan", region: "Asia Timur", thumb: "https://picsum.photos/seed/seoul66/200/150.jpg" },
  { id: 7, name: "Roma, Italia", region: "Eropa", thumb: "https://picsum.photos/seed/roma77/200/150.jpg" },
  { id: 8, name: "Mekah, Arab Saudi", region: "Timur Tengah", thumb: "https://picsum.photos/seed/mekah88/200/150.jpg" },
  { id: 9, name: "Cairo, Mesir", region: "Afrika Utara", thumb: "https://picsum.photos/seed/cairo99/200/150.jpg" },
  { id: 10, name: "New York, Amerika", region: "Amerika Utara", thumb: "https://picsum.photos/seed/newyork10/200/150.jpg" },
];

const templatesDB = [
  { id: 1, name: "Adventure", icon: "fa-mountain-sun", desc: "Eksplorasi, outdoor & adrenalin", focus: "aktivitas petualangan, alam liar, dan pengalaman menantang" },
  { id: 2, name: "Luxury", icon: "fa-gem", desc: "Pengalaman premium & eksklusif", focus: "kemewahan, fine dining, dan pengalaman eksklusif kelas atas" },
  { id: 3, name: "History", icon: "fa-landmark", desc: "Warisan budaya & sejarah", focus: "situs bersejarah, warisan budaya, dan cerita masa lalu yang memukau" },
  { id: 4, name: "Family", icon: "fa-people-group", desc: "Aktivitas ramah keluarga", focus: "aktivitas ramah anak, kebersamaan keluarga, dan keselamatan" },
  { id: 5, name: "Culinary", icon: "fa-utensils", desc: "Wisata kuliner & gastronomi", focus: "makanan khas, street food, dan pengalaman kuliner autentik" },
  { id: 6, name: "Religi", icon: "fa-mosque", desc: "Wisata spiritual & religi", focus: "tempat ibadah, nilai spiritual, dan makna religi yang mendalam" },
];

const toneMap: Record<string, string> = {
  santai:     "Santai & Friendly — gunakan bahasa sehari-hari yang hangat, seperti bicara dengan teman.",
  formal:     "Formal & Profesional — gunakan bahasa baku yang sopan, sesuai untuk grup VIP.",
  humor:      "Humor & Ceria — sisipkan lelucon ringan, permainan kata, dan energi positif.",
  inspiratif: "Inspiratif & Memotivasi — gunakan bahasa yang membangkitkan semangat, penuh makna.",
  edukatif:   "Edukatif & Informatif — sajikan data dan fakta secara terstruktur namun mudah dicerna.",
};

type HistoryEntry = {
  id: number;
  destination: string;
  tone: string;
  template: string;
  prompt: string;
  timestamp: string;
  type: "script";
};

// ─── COMPONENT ─────────────────────────────────────────
export default function ScriptGuidingPage() {
  const [destInput, setDestInput] = useState("");
  const [suggestions, setSuggestions] = useState<typeof destinationsDB>([]);
  const [selectedTone, setSelectedTone] = useState("santai");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: string }[]>([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // NEW STATES FOR ADVANCED PROMPT
  const [audience, setAudience] = useState("");
  const [fact1, setFact1] = useState("");
  const [fact2, setFact2] = useState("");
  const [fact3, setFact3] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [meetingTime, setMeetingTime] = useState("");

  const showToast = (msg: string, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  const handleDestChange = (val: string) => {
    setDestInput(val);
    setSuggestions(
      val.trim().length > 0
        ? destinationsDB.filter((d) =>
            d.name.toLowerCase().includes(val.toLowerCase()) ||
            d.region.toLowerCase().includes(val.toLowerCase())
          ).slice(0, 5)
        : []
    );
  };

  const buildPrompt = (destination: string, tone: string, templateId: number | null, audience: string, fact1: string, fact2: string, fact3: string, meetingPoint: string, meetingTime: string) => {
    const toneDesc = toneMap[tone] || toneMap.santai;
    let templateFocus = "";
    if (templateId) {
      const tpl = templatesDB.find((t) => t.id === templateId);
      if (tpl) templateFocus = `\n\nFOCUS KHUSUS TEMPLATE (${tpl.name}): Fokuskan narasi pada ${tpl.focus}. Sesuaikan contoh, analogi, dan rekomendasi dengan tema ini.`;
    }

    const pointFacts = [fact1, fact2, fact3].filter(f => f.trim()).map((f, i) => `Poin ${i+1}: ${f}`).join('\n');

    return `[Role] Bertindaklah sebagai seorang Senior Tour Leader / Tour Guide yang sangat karismatik, ramah, dan memiliki pengetahuan mendalam serta pengalaman lebih dari 10 tahun di bidang pariwisata.
[Task] Tugas Anda adalah membuat script guiding (teks panduan lisan) yang interaktif, menarik, dan informatif untuk menjelaskan destinasi wisata kepada rombongan turis saya. Gunakan gaya STORYTELLING (bercerita), bukan seperti membaca buku sejarah.
[Audience] Rombongan turis: ${audience || "Umum/Wisatawan Indonesia"}. Sesuaikan gaya bahasa, lelucon, dan referensi agar relevan dengan mereka.
[Context] Destinasi: ${destination}.${pointFacts ? `\nPoin utama yang wajib masuk ke dalam cerita:\n${pointFacts}` : ""}

TONE OF VOICE:
${toneDesc}${templateFocus}
Aktifkan nada bicara yang antusias, interaktif (buat banyak pertanyaan pancingan untuk turis), dan sedikit humor. Hindari bahasa kaku atau istilah akademis yang rumit.

[Output Format] Susun script ini ke dalam struktur berikut agar mudah saya sampaikan:

═══ 1. PEMBUKAAN & ICE BREAKING ═══
• Sambutan hangat dan sapaan yang membangkitkan semangat.
• Perkenalan diri singkat sebagai Tour Leader yang bersahabat.
• [ICE BREAKING]: Gunakan minimal 1 ide pertanyaan interaktif atau games singkat yang spesifik ke konteks ${destination}.

═══ 2. SAFETY & RULES BRIEFING ═══
• Aturan singkat selama di lokasi (kebersihan, keamanan, batasan area).
• **Cetak tebal (BOLD) pada informasi keamanan krusial agar mudah diingat.**

═══ 3. STORYTELLING: SEJARAH & BUDAYA ═══
• Penjelasan destinasi yang dibawakan dengan gaya narasi mengalir.
• Sertakan "5 FAKTA UNIK" tentang ${destination} yang jarang diketahui wisatawan umum.
• Berikan "INSIGHT KHUSUS WISATAWAN INDONESIA" (misal: perbandingan budaya, tips adaptasi praktis, info halal/musholla jika relevan).
• Sajikan dengan cara yang mudah diingat dan tidak membosankan.

═══ 4. PENUTUP & CALL TO ACTION ═══
• Rangkuman inspiratif yang meninggalkan kesan mendalam.
• **ARAHAN JELAS** mengenai: Waktu Bebas (Free Time), Titik Kumpul, dan Jam Berkumpul.
• [PENTING] Gunakan format **BOLD** (cetak tebal) pada: **JAM KUMPUL**, **NAMA TITIK KUMPUL** (${meetingPoint || "Tentukan di lokasi"}), dan **BATAS WAKTU** (${meetingTime || "Sesuai jadwal"}).

[Constraints]
• Gunakan BAHASA INDONESIA lisan yang natural (spoken language, bukan bahasa tulis formal).
• Sisipkan CUE atau CATATAN untuk Tour Leader dalam format [KURUNG SIKU KAPITAL], misalnya: [TUNJUK KE ARAH OBJEK], [BERHENTI SEJENAK].
• Durasi pengucapan: sekitar 3 hingga 5 menit.
• Cantumkan estimasi waktu penyampaian per bagian.
• Tambahkan tips "Pro Tip" singkat di setiap akhir bagian.`;
  };

  const handleGenerate = () => {
    if (!destInput.trim()) {
      showToast("Masukkan nama destinasi terlebih dahulu", "error");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const templateName = selectedTemplateId
        ? templatesDB.find((t) => t.id === selectedTemplateId)?.name || "-"
        : "-";
      const prompt = buildPrompt(destInput, selectedTone, selectedTemplateId, audience, fact1, fact2, fact3, meetingPoint, meetingTime);
      setLastPrompt(prompt);

      // Save to history
      const entry: HistoryEntry = {
        id: Date.now(),
        destination: destInput,
        tone: selectedTone,
        template: templateName,
        prompt,
        timestamp: new Date().toISOString(),
        type: "script",
      };
      const prev = JSON.parse(localStorage.getItem("oatl_history") || "[]");
      localStorage.setItem("oatl_history", JSON.stringify([entry, ...prev].slice(0, 50)));

      setIsLoading(false);
      setPromptModalOpen(true);
    }, 1200);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(lastPrompt).then(() => {
      setCopied(true);
      showToast("Prompt disalin ke clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openChatGPT = () => {
    const url = `https://chatgpt.com/?q=${encodeURIComponent(lastPrompt)}`;
    window.open(url, "_blank");
    showToast("Membuka ChatGPT di tab baru...", "info");
  };

  return (
    <div className="min-h-screen p-5 sm:p-8">
      {/* Page Header */}
      <div className="fade-in-up mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(197,160,89,0.15)", border: "1px solid rgba(197,160,89,0.25)" }}>
            <i className="fas fa-scroll" style={{ color: "#C5A059", fontSize: "15px" }} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Script Guiding Maker</h1>
            <p className="text-white/40 text-[13px]">Generate narasi guiding profesional dalam hitungan detik</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Form Card */}
        <div className="fade-in-up-d1 rounded-2xl p-5 sm:p-7 mb-6"
          style={{ background: "rgba(17,34,64,0.7)", border: "1px solid rgba(197,160,89,0.13)", backdropFilter: "blur(8px)" }}>

          {/* Destination Input */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35 mb-2">
              <i className="fas fa-map-pin mr-1.5" style={{ color: "rgba(197,160,89,0.5)" }} />
              Destinasi Wisata
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={destInput}
                onChange={(e) => handleDestChange(e.target.value)}
                onFocus={(e) => handleDestChange(e.target.value)}
                onBlur={() => setTimeout(() => setSuggestions([]), 200)}
                placeholder="Ketik destinasi, contoh: Tokyo, Jepang..."
                className="input-gold w-full py-3.5 px-4 rounded-xl text-sm font-medium text-white placeholder-white/25"
                style={{ background: "rgba(6,15,29,0.65)", border: "1px solid rgba(197,160,89,0.18)" }}
              />
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 rounded-xl overflow-hidden shadow-2xl z-20"
                  style={{ background: "#112240", border: "1px solid rgba(197,160,89,0.18)" }}>
                  {suggestions.map((d, i) => (
                    <button key={i} type="button"
                      onMouseDown={(e) => { e.preventDefault(); setDestInput(d.name); setSuggestions([]); }}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-colors"
                      style={{ borderBottom: i < suggestions.length - 1 ? "1px solid rgba(197,160,89,0.07)" : "none" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(197,160,89,0.08)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <img src={d.thumb} alt={d.name} className="w-9 h-9 rounded-lg object-cover opacity-70 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-white/80">{d.name}</div>
                        <div className="text-[11px] text-white/30">{d.region}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tone Select */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35 mb-2">
              <i className="fas fa-microphone-lines mr-1.5" style={{ color: "rgba(197,160,89,0.5)" }} />
              Tone of Voice
            </label>
            <div className="relative">
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="input-gold w-full py-3.5 px-4 rounded-xl text-sm font-medium text-white appearance-none cursor-pointer"
                style={{ background: "rgba(6,15,29,0.65)", border: "1px solid rgba(197,160,89,0.18)" }}
              >
                <option value="santai">😊 Santai & Friendly</option>
                <option value="formal">🎩 Formal & Profesional</option>
                <option value="humor">😄 Humor & Ceria</option>
                <option value="inspiratif">✨ Inspiratif & Memotivasi</option>
                <option value="edukatif">📚 Edukatif & Informatif</option>
              </select>
              <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "rgba(197,160,89,0.4)", fontSize: "11px" }} />
            </div>
          </div>

          {/* Template Chips */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-white/35">
                <i className="fas fa-layer-group mr-1.5" style={{ color: "rgba(197,160,89,0.5)" }} />
                Template Narasi <span className="normal-case text-white/20 font-normal">(opsional)</span>
              </label>
              <button 
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="text-[9px] font-bold text-gold hover:text-gold-light transition-colors uppercase tracking-widest flex items-center gap-1"
              >
                <i className={`fas ${isAdvancedOpen ? 'fa-minus-circle' : 'fa-plus-circle'}`}></i>
                {isAdvancedOpen ? 'Sembunyikan' : 'Tambah Detail'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {templatesDB.map((t) => (
                <button key={t.id} type="button"
                  onClick={() => setSelectedTemplateId((p) => (p === t.id ? null : t.id))}
                  className={`chip px-3.5 py-2 rounded-lg text-[12px] font-semibold flex items-center gap-1.5`}
                  style={{
                    border: selectedTemplateId === t.id ? "1px solid var(--gold)" : "1px solid rgba(197,160,89,0.2)",
                    background: selectedTemplateId === t.id ? "rgba(197,160,89,0.18)" : "rgba(17,34,64,0.5)",
                    color: selectedTemplateId === t.id ? "#D4B576" : "rgba(255,255,255,0.45)",
                  }}
                >
                  <i className={`fas ${t.icon} text-[10px]`} />
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          {isAdvancedOpen && (
            <div className="mb-6 p-4 rounded-xl space-y-4 animate-fadeIn" style={{ background: "rgba(6,15,29,0.4)", border: "1px solid rgba(197,160,89,0.1)" }}>
              <div>
                <label className="block text-left text-[9px] font-bold text-gold/60 uppercase tracking-widest mb-1.5 text-xs">Audiens Rombongan</label>
                <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Misal: Keluarga dari Jakarta, Anak SMA" className="input-gold w-full px-3 py-2 rounded-lg bg-navy-dark/60 border border-navy-lighter/30 text-white text-xs" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-left text-[9px] font-bold text-gold/60 uppercase tracking-widest mb-1.5 text-xs">Titik Kumpul</label>
                  <input type="text" value={meetingPoint} onChange={(e) => setMeetingPoint(e.target.value)} placeholder="Misal: Parkiran Bus A" className="input-gold w-full px-3 py-2 rounded-lg bg-navy-dark/60 border border-navy-lighter/30 text-white text-xs" />
                </div>
                <div>
                  <label className="block text-left text-[9px] font-bold text-gold/60 uppercase tracking-widest mb-1.5 text-xs">Jam Kumpul</label>
                  <input type="text" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} placeholder="Misal: 15:30" className="input-gold w-full px-3 py-2 rounded-lg bg-navy-dark/60 border border-navy-lighter/30 text-white text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-left text-[9px] font-bold text-gold/60 uppercase tracking-widest mb-1.5 text-xs">Poin Penting (Wajib Ada)</label>
                <div className="space-y-2">
                  <input type="text" value={fact1} onChange={(e) => setFact1(e.target.value)} placeholder="Poin 1: Sejarah singkat" className="input-gold w-full px-3 py-2 rounded-lg bg-navy-dark/60 border border-navy-lighter/30 text-white text-[11px]" />
                  <input type="text" value={fact2} onChange={(e) => setFact2(e.target.value)} placeholder="Poin 2: Mitos lokal" className="input-gold w-full px-3 py-2 rounded-lg bg-navy-dark/60 border border-navy-lighter/30 text-white text-[11px]" />
                  <input type="text" value={fact3} onChange={(e) => setFact3(e.target.value)} placeholder="Poin 3: Spot foto terbaik" className="input-gold w-full px-3 py-2 rounded-lg bg-navy-dark/60 border border-navy-lighter/30 text-white text-[11px]" />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleGenerate} disabled={isLoading}
              className="btn-primary flex-1 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2.5">
              {isLoading ? (
                <>
                  <svg className="animate-spin" style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Menyusun Prompt...
                </>
              ) : (
                <>
                  <i className="fas fa-wand-magic-sparkles" />
                  Generate Script Prompt
                </>
              )}
            </button>
            {lastPrompt && (
              <button onClick={copyPrompt}
                className="py-3.5 px-5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  border: `2px solid ${copied ? "var(--gold)" : "rgba(197,160,89,0.3)"}`,
                  color: copied ? "var(--gold-light)" : "var(--gold)",
                  background: copied ? "rgba(197,160,89,0.12)" : "transparent",
                }}>
                <i className={`fas ${copied ? "fa-check" : "fa-copy"}`} />
                {copied ? "Tersalin!" : "Salin"}
              </button>
            )}
          </div>
        </div>

        {/* Template Gallery */}
        <div className="fade-in-up-d2">
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/30 mb-4">Pilihan Template</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {templatesDB.map((t) => (
              <button key={t.id} type="button"
                onClick={() => { setSelectedTemplateId(t.id); window.scrollTo({ top: 0, behavior: "smooth" }); showToast(`Template ${t.name} dipilih`, "info"); }}
                className="card-lift group text-left rounded-xl overflow-hidden"
                style={{ background: "rgba(17,34,64,0.6)", border: "1px solid rgba(197,160,89,0.1)" }}>
                <div className="h-24 relative overflow-hidden"
                  style={{ background: "rgba(6,15,29,0.5)" }}>
                  <img src={`https://picsum.photos/seed/${t.name.toLowerCase()}tpl/300/180.jpg`} alt={t.name}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-light via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2.5 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(197,160,89,0.2)", border: "1px solid rgba(197,160,89,0.25)" }}>
                    <i className={`fas ${t.icon}`} style={{ color: "#C5A059", fontSize: "13px" }} />
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-bold text-[13px] text-white/80 group-hover:text-gold-light transition-colors">{t.name}</div>
                  <div className="text-[11px] text-white/35 mt-0.5 leading-relaxed">{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PROMPT MODAL ──────────────────────────────── */}
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
                <h3 className="text-[15px] font-bold text-navy-dark">Prompt Script Guiding</h3>
                <p className="text-[12px] mt-0.5" style={{ color: "rgba(10,25,47,0.5)" }}>
                  Salin prompt lalu buka ChatGPT untuk generate script
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

            {/* Prompt Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 bg-white min-h-0">
              <pre className="text-[13px] leading-relaxed whitespace-pre-wrap font-sans" style={{ color: "rgba(10,25,47,0.8)" }}>
                {lastPrompt}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 flex flex-col sm:flex-row gap-3 flex-shrink-0"
              style={{ background: "#F5F2ED", borderTop: "1px solid #E8E2D8" }}>
              <button onClick={openChatGPT}
                className="btn-primary flex-1 py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                <i className="fas fa-robot" />
                Buka di ChatGPT
              </button>
              <button onClick={copyPrompt}
                className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  border: `2px solid ${copied ? "var(--gold)" : "rgba(10,25,47,0.2)"}`,
                  color: copied ? "var(--gold-dark)" : "rgba(10,25,47,0.65)",
                  background: copied ? "rgba(197,160,89,0.08)" : "transparent",
                }}>
                <i className={`fas ${copied ? "fa-check" : "fa-copy"}`} />
                {copied ? "Tersalin!" : "Salin Prompt"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST ─────────────────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-[90] flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-xl"
            style={{
              background: t.type === "error" ? "rgba(220,38,38,0.92)" : t.type === "info"
                ? "rgba(17,34,64,0.95)" : "rgba(5,150,105,0.92)",
              border: t.type === "info" ? "1px solid rgba(197,160,89,0.25)" : "none",
              backdropFilter: "blur(12px)",
              animation: "fadeInUp 0.3s ease",
              color: "white",
            }}>
            <i className={`fas ${t.type === "error" ? "fa-circle-exclamation" : t.type === "info" ? "fa-circle-info" : "fa-circle-check"} opacity-80`} />
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
