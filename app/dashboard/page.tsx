import { logoutAction } from "@/app/actions/auth";

export default function DashboardPage() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0a1628' }}>
      {/* Navigasi Atas */}
      <header style={{ 
        padding: '12px 20px', 
        backgroundColor: '#0a1628', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(59,130,246,0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              background: 'linear-gradient(135deg, rgba(245,158,11,0.18) 0%, rgba(30,58,138,0.4) 100%)', 
              border: '1px solid rgba(245,158,11,0.18)',
              borderRadius: '8px',
              padding: '6px'
            }}>
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
            </span>
            <span style={{ color: 'white', fontWeight: 'bold' }}>Content Idea TL - Premium Access</span>
        </div>
        <form action={logoutAction}>
            <button type="submit" style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '6px 14px',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer'
            }}>
                Logout
            </button>
        </form>
      </header>

      {/* Menampilkan File dari folder public/app-lama */}
      <iframe 
        src="/app-lama/index.html" 
        style={{ 
          flex: 1, 
          border: 'none', 
          width: '100%', 
          height: '100%' 
        }} 
        title="Content Idea App"
      />
    </div>
  );
}
