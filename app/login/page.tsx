"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
            --bg: #0a1628;
            --fg: #f8fafc;
            --muted: #94a3b8;
            --accent: #f59e0b;
            --card: rgba(15, 23, 42, 0.65);
            --border: rgba(59, 130, 246, 0.12);
        }
        body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            background: var(--bg);
            color: var(--fg);
            min-height: 100vh;
            overflow-x: hidden;
            margin: 0;
        }

        .bg-scene {
            position: fixed; inset: 0; z-index: 0;
            background:
                radial-gradient(ellipse 80% 55% at 15% 8%, rgba(30,58,138,0.55) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 85% 85%, rgba(245,158,11,0.07) 0%, transparent 50%),
                linear-gradient(180deg, #0a1628 0%, #0d1b33 50%, #0a1628 100%);
        }
        .orb {
            position: fixed; border-radius: 50%; filter: blur(90px);
            opacity: .35; pointer-events: none; z-index: 0;
            animation: orbDrift 22s ease-in-out infinite;
        }
        .orb-a { width: 320px; height: 320px; background: rgba(30,58,138,0.65); top: -90px; right: -60px; }
        .orb-b { width: 220px; height: 220px; background: rgba(245,158,11,0.13); bottom: 8%; left: -70px; animation-delay: -8s; }
        .orb-c { width: 260px; height: 260px; background: rgba(37,99,235,0.28); top: 55%; right: -90px; animation-delay: -15s; }
        @keyframes orbDrift {
            0%,100% { transform: translate(0,0) scale(1); }
            33%     { transform: translate(25px,-18px) scale(1.06); }
            66%     { transform: translate(-18px,14px) scale(.94); }
        }
        .grid-pat {
            position: fixed; inset: 0; z-index: 0; pointer-events: none;
            background-image:
                linear-gradient(rgba(59,130,246,.025) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59,130,246,.025) 1px, transparent 1px);
            background-size: 56px 56px;
        }
        .dot {
            position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
            animation: dotFloat 18s ease-in-out infinite;
        }
        @keyframes dotFloat {
            0%,100% { transform: translateY(0) scale(1); opacity: .25; }
            50%     { transform: translateY(-30px) scale(1.3); opacity: .5; }
        }

        .glass {
            background: var(--card);
            backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
            border: 1px solid var(--border);
            border-radius: 1rem;
        }

        .input-field {
            background: rgba(15,23,42,0.55);
            border: 1px solid rgba(59,130,246,0.12);
            color: var(--fg);
            outline: none;
            transition: all .2s;
        }
        .input-field::placeholder { color: #475569; }
        .input-field:focus {
            border-color: rgba(245,158,11,0.35);
            box-shadow: 0 0 0 3px rgba(245,158,11,0.1), 0 0 24px rgba(245,158,11,0.04);
        }

        .btn-gen {
            position: relative; overflow: hidden;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: #0f172a; font-weight: 800;
            transition: all .3s;
        }
        .btn-gen::before {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,.18) 0%, transparent 55%);
            opacity: 0; transition: opacity .3s;
        }
        .btn-gen:hover::before { opacity: 1; }
        .btn-gen:hover {
            box-shadow: 0 6px 30px rgba(245,158,11,.35), 0 0 60px rgba(245,158,11,.08);
            transform: translateY(-1px);
        }
        .btn-gen:active { transform: translateY(0) scale(.98); }
        .btn-gen:disabled {
            background: linear-gradient(135deg, #1e293b, #0f172a);
            color: #1e293b; cursor: not-allowed;
            box-shadow: none; transform: none;
        }
        .btn-gen:disabled::before { display: none; }

        .compass-spin { animation: spinSlow 28s linear infinite; }
        @keyframes spinSlow { to { transform: rotate(360deg); } }

        .accent-line {
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, #f59e0b 30%, #f59e0b 70%, transparent 100%);
            opacity: .3; border-radius: 1px;
        }
      `}} />

      {/* Decorative Background Matches User HTML */}
      <div className="bg-scene" aria-hidden="true"></div>
      <div className="orb orb-a" aria-hidden="true"></div>
      <div className="orb orb-b" aria-hidden="true"></div>
      <div className="orb orb-c" aria-hidden="true"></div>
      <div className="grid-pat" aria-hidden="true"></div>
      <div className="dot" style={{width: 3, height: 3, background: 'rgba(245,158,11,.3)', top: '12%', left: '18%', animationDelay: '0s'}} aria-hidden="true"></div>
      <div className="dot" style={{width: 2, height: 2, background: 'rgba(59,130,246,.35)', top: '25%', left: '75%', animationDelay: '-4s'}} aria-hidden="true"></div>
      <div className="dot" style={{width: 4, height: 4, background: 'rgba(245,158,11,.18)', top: '45%', left: '8%', animationDelay: '-9s'}} aria-hidden="true"></div>
      <div className="dot" style={{width: 2, height: 2, background: 'rgba(96,165,250,.3)', top: '60%', left: '88%', animationDelay: '-2s'}} aria-hidden="true"></div>
      <div className="dot" style={{width: 3, height: 3, background: 'rgba(245,158,11,.22)', top: '78%', left: '35%', animationDelay: '-13s'}} aria-hidden="true"></div>
      <div className="dot" style={{width: 2, height: 2, background: 'rgba(59,130,246,.25)', top: '88%', left: '62%', animationDelay: '-7s'}} aria-hidden="true"></div>

      <div style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
      }}>
          <div style={{ width: '100%', maxWidth: '400px' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(30,58,138,0.4) 100%)',
                      border: '1px solid rgba(245,158,11,0.18)',
                      marginBottom: '16px'
                  }}>
                      <div className="compass-spin">
                          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                      </div>
                  </div>
                  <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, margin: '0 0 6px 0'}}>
                      Content Idea <span style={{ color: '#f59e0b' }}>Tour Leader</span>
                  </h1>
                  <p style={{ color: '#7c8db5', fontSize: '14px', margin: 0 }}>Portal Premium - Masuk ke akun Anda</p>
                  <div className="accent-line max-w-[120px] mx-auto mt-4"></div>
              </div>

              <form action={formAction} className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {state?.error && (
                      <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '13px', textAlign: 'center' }}>
                          {state.error}
                      </div>
                  )}
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7c8db5' }}>Email Akun</label>
                      <input 
                          type="text" 
                          name="email" 
                          placeholder="email@tourleader.id"
                          required
                          className="input-field"
                          style={{
                              padding: '14px 16px',
                              borderRadius: '12px',
                              fontSize: '14px',
                              width: '100%',
                              boxSizing: 'border-box'
                          }}
                      />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7c8db5' }}>Kata Sandi</label>
                      <div style={{ position: 'relative' }}>
                          <input 
                              type={showPassword ? "text" : "password"} 
                              name="password" 
                              placeholder="••••••••••••"
                              required
                              className="input-field"
                              style={{
                                  padding: '14px 48px 14px 16px',
                                  borderRadius: '12px',
                                  fontSize: '14px',
                                  width: '100%',
                                  boxSizing: 'border-box'
                              }}
                          />
                          <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)}
                              style={{
                                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                                  background: 'none', border: 'none', color: '#7c8db5', cursor: 'pointer', padding: '4px'
                              }}
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  {showPassword ? (
                                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/>
                                  ) : (
                                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                                  )}
                              </svg>
                          </button>
                      </div>
                  </div>

                  <button 
                      type="submit" 
                      disabled={isPending}
                      className="btn-gen"
                      style={{
                          padding: '14px',
                          borderRadius: '12px',
                          border: 'none',
                          cursor: isPending ? 'not-allowed' : 'pointer',
                          fontSize: '15px',
                          marginTop: '8px'
                      }}
                  >
                      {isPending ? "Memproses Autentikasi..." : "Log In Sekarang"}
                  </button>
              </form>
          </div>
      </div>
    </>
  );
}
