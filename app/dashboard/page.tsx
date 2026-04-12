"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// DUMMY DATABASE
const destinationsDB = [
    { id:1,  name:'Tokyo, Jepang',           region:'Asia Timur',     thumb:'https://picsum.photos/seed/tokyo22/200/150.jpg' },
    { id:2,  name:'Paris, Prancis',            region:'Eropa',          thumb:'https://picsum.photos/seed/paris44/200/150.jpg' },
    { id:3,  name:'Bali, Indonesia',           region:'Asia Tenggara',  thumb:'https://picsum.photos/seed/bali33/200/150.jpg' },
    { id:4,  name:'Istanbul, Turki',           region:'Eurasia',        thumb:'https://picsum.photos/seed/istanbul11/200/150.jpg' },
    { id:5,  name:'Dubai, UAE',                region:'Timur Tengah',   thumb:'https://picsum.photos/seed/dubai55/200/150.jpg' },
    { id:6,  name:'Seoul, Korea Selatan',      region:'Asia Timur',     thumb:'https://picsum.photos/seed/seoul66/200/150.jpg' },
];

const templatesDB = [
    { id:1, name:'Adventure',  icon:'fa-mountain-sun',  desc:'Fokus eksplorasi, outdoor, dan adrenalin',         focus:'aktivitas petualangan, alam liar, dan pengalaman menantang' },
    { id:2, name:'Luxury',     icon:'fa-gem',           desc:'Fokus pengalaman premium dan eksklusif',            focus:'kemewahan, fine dining, dan pengalaman eksklusif kelas atas' },
    { id:3, name:'History',    icon:'fa-landmark',      desc:'Fokus warisan budaya dan sejarah',                  focus:'situs bersejarah, warisan budaya, dan cerita masa lalu yang memukau' },
    { id:4, name:'Family',     icon:'fa-people-group',  desc:'Fokus aktivitas ramah keluarga dan anak-anak',       focus:'aktivitas ramah anak, kebersamaan keluarga, dan keselamatan' },
    { id:5, name:'Culinary',   icon:'fa-utensils',      desc:'Fokus wisata kuliner dan gastronomi lokal',         focus:'makanan khas, street food, dan pengalaman kuliner autentik' },
];

const toneMap: Record<string, string> = {
    santai:     'Santai & Friendly — gunakan bahasa sehari-hari yang hangat, seperti bicara dengan teman.',
    formal:     'Formal & Profesional — gunakan bahasa baku yang sopan, sesuai untuk grup VIP.',
    humor:      'Humor & Ceria — sisipkan lelucon ringan, permainan kata, dan energi positif.',
    inspiratif: 'Inspiratif & Memotivasi — gunakan bahasa yang membangkitkan semangat, penuh makna.',
    edukatif:   'Edukatif & Informatif — sajikan data dan fakta secara terstruktur namun mudah dicerna.',
};

type HistoryEntry = {
    id: number;
    destination: string;
    tone: string;
    template: string;
    prompt: string;
    timestamp: string;
};

export default function DashboardPage() {
    const [destInput, setDestInput] = useState("");
    const [suggestions, setSuggestions] = useState<typeof destinationsDB>([]);
    const [selectedTone, setSelectedTone] = useState("santai");
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    
    const router = useRouter();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [profileName, setProfileName] = useState("Tour Leader");
    const [profileEmail, setProfileEmail] = useState("admin@tourleader.id");
    const [profilePassword, setProfilePassword] = useState("");
    const [showProfilePassword, setShowProfilePassword] = useState(false);
    
    const [promptModalOpen, setPromptModalOpen] = useState(false);
    const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState("");
    
    // NEW STATES FOR ADVANCED PROMPT
    const [audience, setAudience] = useState("");
    const [fact1, setFact1] = useState("");
    const [fact2, setFact2] = useState("");
    const [fact3, setFact3] = useState("");
    const [meetingPoint, setMeetingPoint] = useState("");
    const [meetingTime, setMeetingTime] = useState("");
    
    const [toasts, setToasts] = useState<{id: number, message: string, type: string}[]>([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('sgm_history');
            if (saved) setHistory(JSON.parse(saved));
            
            const savedProfile = localStorage.getItem('sgm_profile');
            if (savedProfile) {
                const parsed = JSON.parse(savedProfile);
                setProfileName(parsed.name || "Tour Leader");
                setProfileEmail(parsed.email || "admin@tourleader.id");
            }
        } catch(e) {}
    }, []);

    const saveHistory = (newHistory: HistoryEntry[]) => {
        const trimmed = newHistory.slice(0, 50);
        localStorage.setItem('sgm_history', JSON.stringify(trimmed));
        setHistory(trimmed);
    };

    const showToast = (message: string, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const updatePayload: any = { name: profileName };
        if (profilePassword) {
            updatePayload.password = profilePassword;
        }

        const { error } = await supabase
            .from("users")
            .update(updatePayload)
            .eq("email", profileEmail);

        if (error) {
            showToast(`Gagal menyimpan profil: ${error.message}`, 'error');
            return;
        }

        localStorage.setItem('sgm_profile', JSON.stringify({ name: profileName, email: profileEmail }));
        setProfilePassword("");
        setShowProfilePassword(false);
        setIsAccountOpen(false);
        showToast('Profil berhasil disimpan', 'success');
    };

    const handleLogout = () => {
        showToast('Keluar dari akun...', 'info');
        setTimeout(() => router.push('/login'), 800);
    };

    const handleDestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDestInput(val);
        if (val.trim().length > 0) {
            setSuggestions(destinationsDB.filter(d => 
                d.name.toLowerCase().includes(val.toLowerCase()) || 
                d.region.toLowerCase().includes(val.toLowerCase())
            ).slice(0, 5));
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (name: string) => {
        setDestInput(name);
        setSuggestions([]);
    };

    const constructPrompt = (destination: string, tone: string, templateId: number | null, audience: string, fact1: string, fact2: string, fact3: string, meetingPoint: string, meetingTime: string) => {
        const toneDesc = toneMap[tone] || toneMap.santai;
        let templateFocus = '';
        if (templateId) {
            const tpl = templatesDB.find(t => t.id === templateId);
            if (tpl) {
                templateFocus = `\n\nFOCUS KHUSUS TEMPLATE (${tpl.name}): Fokuskan narasi pada ${tpl.focus}. Sesuaikan contoh, analogi, dan rekomendasi dengan tema ini.`;
            }
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
            showToast('Masukkan nama destinasi terlebih dahulu', 'error');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            const templateName = selectedTemplateId 
                ? templatesDB.find(t => t.id === selectedTemplateId)?.name || "-" 
                : "-";
            const prompt = constructPrompt(destInput, selectedTone, selectedTemplateId, audience, fact1, fact2, fact3, meetingPoint, meetingTime);
            setLastGeneratedPrompt(prompt);
            
            const entry = {
                id: Date.now(),
                destination: destInput,
                tone: selectedTone,
                template: templateName,
                prompt: prompt,
                timestamp: new Date().toISOString(),
            };
            saveHistory([entry, ...history]);
            setIsLoading(false);
            setPromptModalOpen(true);
        }, 1600);
    };

    const copyPrompt = () => {
        navigator.clipboard.writeText(lastGeneratedPrompt).then(() => {
            showToast('Prompt disalin ke clipboard', 'success');
        });
    };

    const openChatGPT = () => {
        const url = `https://chatgpt.com/?q=${encodeURIComponent(lastGeneratedPrompt)}`;
        window.open(url, '_blank');
        showToast('Membuka ChatGPT di tab baru...', 'info');
    };

    return (
        <div className="relative min-h-screen z-10 w-full overflow-x-hidden">
            {/* Header / Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-navy-lighter/40" style={{ background: 'rgba(10,25,47,0.85)', backdropFilter: 'blur(16px)' }}>
                <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center group-hover:shadow-lg group-hover:shadow-gold/20 transition-shadow">
                            <i className="fas fa-compass text-navy text-sm"></i>
                        </div>
                        <span className="text-base font-bold tracking-tight hidden sm:block">
                            <span className="text-white">Script</span><span className="gold-text">Guiding</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button onClick={() => setIsAccountOpen(true)} className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all border border-white/10 hidden sm:inline-flex items-center mr-0.5">
                            <i className="fas fa-user-circle mr-1.5"></i>Akun
                        </button>
                        <button onClick={() => setIsAccountOpen(true)} className="w-8 h-8 rounded-lg flex sm:hidden items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all border border-white/10 mr-0.5">
                            <i className="fas fa-user-circle"></i>
                        </button>
                        <button onClick={() => setIsAdminOpen(!isAdminOpen)} className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${isAdminOpen ? 'text-gold bg-gold-muted' : 'text-white/60 hover:text-gold hover:bg-gold-muted'}`}>
                            <i className="fas fa-chart-simple mr-1.5"></i><span className="hidden sm:inline">Dashboard</span>
                        </button>
                        <button onClick={() => setIsHistoryOpen(true)} className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-navy bg-gradient-to-r from-gold to-gold-light hover:shadow-lg hover:shadow-gold/25 transition-all">
                            <i className="fas fa-clock-rotate-left mr-1.5"></i>My History
                        </button>
                    </div>
                </nav>
            </header>

            {/* Background Map Grid */}
            <div className="fixed inset-0 pointer-events-none z-0 map-grid" aria-hidden="true">
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, #C5A059 0%, transparent 70%)" }}></div>
                <div className="absolute -bottom-48 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #D4B576 0%, transparent 70%)" }}></div>
                <div className="absolute top-1/4 right-[15%] w-32 h-32 rounded-full border border-gold/[0.06] spin-slow"></div>
            </div>

            {/* Main Content */}
            <main className="relative z-10 pt-16">
                {!isAdminOpen ? (
                    <>
                        <section className="min-h-[92vh] flex items-center justify-center px-4 pt-16 pb-8">
                            <div className="max-w-xl w-full text-center">
                                <div className="fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold-muted mb-6">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold pulse-gold"></span>
                                    <span className="text-xs font-semibold text-gold-light tracking-wide uppercase">Tour Leader Productivity Tool</span>
                                </div>
                                <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-4">
                                    Buat Narasi Guiding<br/><span className="gold-text">dalam Hitungan Detik</span>
                                </h1>
                                <p className="fade-in-up-d2 text-sm sm:text-base text-white/50 leading-relaxed max-w-md mx-auto mb-10">
                                    Otomatisasi pembuatan script guiding profesional dengan prompt engineering yang teruji. Cukup masukkan destinasi, pilih gaya, dan biarkan AI mengerjakan sisanya.
                                </p>

                                <div className="fade-in-up-d2 bg-navy-light/80 border border-navy-lighter/60 rounded-2xl p-5 sm:p-7 shadow-2xl shadow-black/30" style={{ backdropFilter: "blur(8px)" }}>
                                    {/* Input Destinasi */}
                                    <div className="relative mb-4">
                                        <label className="block text-left text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Destinasi</label>
                                        <div className="relative">
                                            <i className="fas fa-map-pin absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 text-sm"></i>
                                            <input type="text" value={destInput} onChange={handleDestChange} onFocus={(e) => handleDestChange(e)} onBlur={() => setTimeout(() => setSuggestions([]), 200)} placeholder="Contoh: Tokyo, Jepang" className="input-gold w-full pl-11 pr-4 py-3.5 rounded-xl bg-navy-dark/60 border border-navy-lighter/50 text-white placeholder-white/25 text-sm font-medium"/>
                                        </div>
                                        {suggestions.length > 0 && (
                                            <div className="absolute left-0 right-0 top-full mt-1 bg-navy-light border border-navy-lighter/50 rounded-xl overflow-hidden shadow-2xl shadow-black/40 z-30 max-h-56 overflow-y-auto">
                                                {suggestions.map((d, i) => (
                                                    <button key={i} onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(d.name); }} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gold-muted transition-colors text-sm">
                                                        <img src={d.thumb} alt={d.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0 opacity-70" />
                                                        <div className="min-w-0">
                                                            <div className="font-medium text-white/80 truncate">{d.name}</div>
                                                            <div className="text-[11px] text-white/30">{d.region}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Select Tone */}
                                    <div className="mb-4">
                                        <label className="block text-left text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Tone of Voice</label>
                                        <div className="relative">
                                            <i className="fas fa-microphone-lines absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 text-sm pointer-events-none"></i>
                                            <select value={selectedTone} onChange={(e) => setSelectedTone(e.target.value)} className="input-gold w-full pl-11 pr-10 py-3.5 rounded-xl bg-navy-dark/60 border border-navy-lighter/50 text-white text-sm font-medium appearance-none cursor-pointer">
                                                <option value="santai">Santai & Friendly</option>
                                                <option value="formal">Formal & Profesional</option>
                                                <option value="humor">Humor & Ceria</option>
                                                <option value="inspiratif">Inspiratif & Memotivasi</option>
                                                <option value="edukatif">Edukatif & Informatif</option>
                                            </select>
                                            <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gold/40 text-xs pointer-events-none"></i>
                                        </div>
                                    </div>

                                    {/* Template Chips */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Template Narasi <span className="normal-case text-white/25">(opsional)</span></label>
                                            <button 
                                                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                                                className="text-[10px] font-bold text-gold hover:text-gold-light transition-colors uppercase tracking-widest flex items-center gap-1"
                                            >
                                                <i className={`fas ${isAdvancedOpen ? 'fa-minus-circle' : 'fa-plus-circle'}`}></i>
                                                {isAdvancedOpen ? 'Hide' : 'Add Detail'}
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {templatesDB.map(t => (
                                                <button key={t.id} onClick={() => setSelectedTemplateId(prev => prev === t.id ? null : t.id)} className={`chip px-3.5 py-2 rounded-lg border border-navy-lighter/40 text-xs font-semibold text-white/50 flex items-center gap-1.5 ${selectedTemplateId === t.id ? 'active' : ''}`}>
                                                    <i className={`fas ${t.icon} text-[10px]`}></i>{t.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Advanced Options */}
                                    {isAdvancedOpen && (
                                        <div className="mb-6 p-4 rounded-xl bg-navy-dark/40 border border-gold/10 space-y-4 animate-fadeIn">
                                            <div>
                                                <label className="block text-left text-[10px] font-bold text-gold/60 uppercase tracking-widest mb-1.5">Audiens Rombongan</label>
                                                <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Misal: Keluarga dari Jakarta, Anak SMA" className="input-gold w-full px-3 py-2 rounded-lg bg-navy-dark/60 border border-navy-lighter/30 text-white text-xs" />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-left text-[10px] font-bold text-gold/60 uppercase tracking-widest mb-1.5">Titik Kumpul</label>
                                                    <input type="text" value={meetingPoint} onChange={(e) => setMeetingPoint(e.target.value)} placeholder="Misal: Parkiran Bus A" className="input-gold w-full px-3 py-2 rounded-lg bg-navy-dark/60 border border-navy-lighter/30 text-white text-xs" />
                                                </div>
                                                <div>
                                                    <label className="block text-left text-[10px] font-bold text-gold/60 uppercase tracking-widest mb-1.5">Jam Kumpul</label>
                                                    <input type="text" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} placeholder="Misal: 15:30" className="input-gold w-full px-3 py-2 rounded-lg bg-navy-dark/60 border border-navy-lighter/30 text-white text-xs" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-left text-[10px] font-bold text-gold/60 uppercase tracking-widest mb-1.5">Poin Penting (Wajib Ada)</label>
                                                <div className="space-y-2">
                                                    <input type="text" value={fact1} onChange={(e) => setFact1(e.target.value)} placeholder="Poin 1: Misal Sejarah singkat" className="input-gold w-full px-3 py-2 rounded-lg bg-navy-dark/60 border border-navy-lighter/30 text-white text-[11px]" />
                                                    <input type="text" value={fact2} onChange={(e) => setFact2(e.target.value)} placeholder="Poin 2: Misal Mitos lokal" className="input-gold w-full px-3 py-2 rounded-lg bg-navy-dark/60 border border-navy-lighter/30 text-white text-[11px]" />
                                                    <input type="text" value={fact3} onChange={(e) => setFact3(e.target.value)} placeholder="Poin 3: Misal Spot foto terbaik" className="input-gold w-full px-3 py-2 rounded-lg bg-navy-dark/60 border border-navy-lighter/30 text-white text-[11px]" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button onClick={handleGenerate} disabled={isLoading} className="btn-primary flex-1 py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2.5">
                                            {isLoading ? (
                                                <span className="flex items-center gap-2.5">
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                                    </svg>
                                                    Menyusun prompt...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2.5">
                                                    <i className="fas fa-wand-magic-sparkles"></i>
                                                    Generate & Redirect
                                                </span>
                                            )}
                                        </button>
                                        {lastGeneratedPrompt && (
                                            <button onClick={copyPrompt} className="py-3.5 px-5 rounded-xl text-sm font-semibold border-2 border-gold/30 text-gold hover:border-gold hover:bg-gold-muted transition-all flex items-center justify-center gap-2">
                                                <i className="fas fa-copy"></i> Salin
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        {/* Showcase Template */}
                        <section className="py-16 sm:py-24 px-4 border-t border-navy-lighter/20 bg-navy/50">
                            <div className="max-w-5xl mx-auto">
                                <h2 className="text-white text-center text-2xl sm:text-3xl font-bold mb-3">Template Narasi</h2>
                                <p className="text-center text-white/40 text-sm mb-12 max-w-md mx-auto">Pilih fokus narasi yang paling sesuai dengan jenis tur Anda</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {templatesDB.map(t => (
                                        <div key={t.id} onClick={() => { setSelectedTemplateId(t.id); window.scrollTo({top:0, behavior:'smooth'}); showToast('Template dipilih', 'info'); }} className="card-lift bg-navy-light/50 border border-navy-lighter/40 rounded-2xl overflow-hidden cursor-pointer group">
                                            <div className="h-36 bg-navy-dark/50 relative overflow-hidden">
                                                <img src={`https://picsum.photos/seed/${t.name.toLowerCase()}tpl/400/200.jpg`} alt={t.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-navy-light via-transparent to-transparent"></div>
                                                <div className="absolute bottom-3 left-4 w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                                                    <i className={`fas ${t.icon} text-gold`}></i>
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-bold text-base mb-1 group-hover:text-gold-light transition-colors">{t.name}</h3>
                                                <p className="text-xs text-white/40 leading-relaxed">{t.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </>
                ) : (
                    <section className="py-16 sm:py-24 px-4 min-h-[92vh]">
                        <div className="max-w-5xl mx-auto">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold mb-1">Dashboard Admin</h2>
                                    <p className="text-white/40 text-sm">Statistik penggunaan Script Guiding Maker</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                                <div className="bg-navy-light/50 border border-navy-lighter/40 rounded-xl p-4 sm:p-5">
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <i className="fas fa-file-lines text-gold text-sm"></i>
                                        <span className="text-xs font-semibold text-white/35 uppercase tracking-wider">Total Generate</span>
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-extrabold text-white">{history.length}</div>
                                </div>
                            </div>
                            <div className="bg-navy-light/50 border border-navy-lighter/40 rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-navy-lighter/30">
                                    <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">Aktivitas Terakhir</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-navy-lighter/20 text-left text-xs text-white/30 uppercase tracking-wider">
                                                <th className="px-6 py-3 font-semibold">Destinasi</th>
                                                <th className="px-6 py-3 font-semibold">Tone</th>
                                                <th className="px-6 py-3 font-semibold">Template</th>
                                                <th className="px-6 py-3 font-semibold">Tanggal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.slice(0,10).map(h => (
                                                <tr key={h.id} className="border-b border-navy-lighter/15 hover:bg-navy-lighter/10 transition-colors">
                                                    <td className="px-6 py-3.5 font-medium text-white/70">{h.destination}</td>
                                                    <td className="px-6 py-3.5 text-white/40 capitalize">{h.tone}</td>
                                                    <td className="px-6 py-3.5 text-white/40">{h.template}</td>
                                                    <td className="px-6 py-3.5 text-white/30 text-xs whitespace-nowrap">{new Date(h.timestamp).toLocaleDateString('id-ID')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {history.length === 0 && (
                                        <div className="p-10 text-center text-white/25 text-sm">Belum ada aktivitas</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* History Sidebar */}
            {isHistoryOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-[55]" style={{ backdropFilter: 'blur(4px)' }} onClick={() => setIsHistoryOpen(false)}></div>
                    <aside className="sidebar-slide fixed top-0 right-0 h-full w-full sm:w-[400px] z-[60] bg-navy-light text-white transform translate-x-0 border-l border-navy-lighter/40 flex flex-col">
                        <div className="p-5 sm:p-6 border-b border-navy-lighter/30 flex items-center justify-between">
                            <h2 className="text-lg font-bold">Riwayat Pencarian</h2>
                            <button onClick={() => setIsHistoryOpen(false)} className="w-9 h-9 rounded-lg hover:bg-navy-lighter/40 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                                <i className="fas fa-xmark"></i>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
                            {history.length > 0 ? history.map((h, i) => (
                                <button key={i} onClick={() => {
                                    setDestInput(h.destination);
                                    setSelectedTone(h.tone);
                                    const tpl = templatesDB.find(t => t.name === h.template);
                                    setSelectedTemplateId(tpl ? tpl.id : null);
                                    setIsHistoryOpen(false);
                                    setIsAdminOpen(false);
                                    window.scrollTo({top:0, behavior:'smooth'});
                                }} className="w-full text-left p-4 rounded-xl bg-navy-dark/40 border border-navy-lighter/20 hover:border-gold/30 hover:bg-navy-dark/60 transition-all group">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="font-semibold text-sm text-white/80 group-hover:text-gold-light transition-colors truncate">{h.destination}</div>
                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                <span className="text-[11px] px-2 py-0.5 rounded-md bg-gold-muted text-gold/70 font-medium">{h.tone}</span>
                                                {h.template !== '-' && <span className="text-[11px] px-2 py-0.5 rounded-md bg-navy-lighter/30 text-white/40 font-medium">{h.template}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[11px] text-white/25 mt-2.5">{new Date(h.timestamp).toLocaleDateString('id-ID', {hour:'2-digit', minute:'2-digit'})}</div>
                                </button>
                            )) : (
                                <div className="text-center py-12 text-white/25">Belum ada riwayat</div>
                            )}
                        </div>
                        <div className="p-5 border-t border-navy-lighter/30 flex-shrink-0">
                            <button onClick={() => saveHistory([])} className="w-full py-2.5 rounded-xl text-xs font-semibold text-red-400/70 border border-red-400/20 hover:bg-red-400/10 transition-all">
                                Hapus Semua Riwayat
                            </button>
                        </div>
                    </aside>
                </>
            )}

            {/* Prompt Preview Modal */}
            {promptModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60" style={{ backdropFilter: 'blur(6px)' }} onClick={() => setPromptModalOpen(false)}></div>
                    <div className="modal-enter relative bg-beige rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="px-6 py-4 border-b border-beige-dark flex items-center justify-between flex-shrink-0">
                            <div>
                                <h3 className="text-base font-bold text-navy">Preview Prompt</h3>
                                <p className="text-xs text-navy/40 mt-0.5">Review prompt sebelum mengirim ke ChatGPT</p>
                            </div>
                            <button onClick={() => setPromptModalOpen(false)} className="w-8 h-8 rounded-lg hover:bg-navy/5 flex items-center justify-center text-navy/40 hover:text-navy transition-colors">
                                <i className="fas fa-xmark"></i>
                            </button>
                        </div>
                        <div className="px-6 py-5 overflow-y-auto w-full flex-1 min-h-0 bg-white">
                            <pre className="text-navy/80 text-[13px] leading-relaxed whitespace-pre-wrap font-sans">
                                {lastGeneratedPrompt}
                            </pre>
                        </div>
                        <div className="px-6 py-4 border-t border-beige-dark flex flex-col sm:flex-row gap-3 bg-beige flex-shrink-0">
                            <button onClick={openChatGPT} className="btn-primary flex-1 py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                                <i className="fab fa-robot"></i> Buka di ChatGPT
                            </button>
                            <button onClick={copyPrompt} className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 border-navy/20 text-navy hover:bg-navy/5 transition-all flex items-center justify-center gap-2">
                                <i className="fas fa-copy"></i> Salin Prompt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Settings Modal */}
            {isAccountOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60" style={{ backdropFilter: 'blur(6px)' }} onClick={() => setIsAccountOpen(false)}></div>
                    <div className="modal-enter relative bg-navy-light border border-navy-lighter/60 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col pt-6 pb-6 px-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">Pengaturan Akun</h3>
                            <button onClick={() => setIsAccountOpen(false)} className="w-8 h-8 rounded-lg hover:bg-navy-lighter/40 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                                <i className="fas fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Nama Profile</label>
                                <div className="relative">
                                    <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 text-sm"></i>
                                    <input type="text" required value={profileName} onChange={(e) => setProfileName(e.target.value)} className="input-gold w-full pl-11 pr-4 py-3 rounded-xl bg-navy-dark/60 border border-navy-lighter/50 text-white text-sm font-medium" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Email</label>
                                <div className="relative">
                                    <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 text-sm"></i>
                                    <input type="email" disabled value={profileEmail} className="input-gold w-full pl-11 pr-4 py-3 rounded-xl bg-navy-dark/40 border border-navy-lighter/30 text-white/50 cursor-not-allowed text-sm font-medium" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Password Baru <span className="normal-case text-white/20">(kosongi jika tidak diubah)</span></label>
                                <div className="relative">
                                    <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 text-sm"></i>
                                    <input 
                                        type={showProfilePassword ? "text" : "password"} 
                                        value={profilePassword} 
                                        onChange={(e) => setProfilePassword(e.target.value)} 
                                        placeholder="••••••••"
                                        className="input-gold w-full pl-11 pr-12 py-3 rounded-xl bg-navy-dark/60 border border-navy-lighter/50 text-white text-sm font-medium" 
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowProfilePassword(!showProfilePassword)}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                    >
                                      <i className={`fas ${showProfilePassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                            <div className="pt-2 flex flex-col gap-3">
                                <button type="submit" className="btn-primary w-full py-3 rounded-xl text-sm font-bold shadow-lg">Simpan Profil</button>
                                <button type="button" onClick={handleLogout} className="w-full py-3 rounded-xl text-sm font-semibold text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors"> <i className="fas fa-sign-out-alt mr-2"></i>Keluar Akun</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast Container */}
            <div className="fixed bottom-5 right-5 z-[90] flex flex-col gap-2.5 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-xl ${t.type === 'error' ? 'bg-red-600/90 text-white' : 'bg-emerald-600/90 text-white'}`} style={{ backdropFilter:'blur(12px)', animation:'fadeInUp 0.3s ease' }}>
                        <i className={`fas ${t.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'} text-base opacity-80`}></i>
                        <span>{t.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
