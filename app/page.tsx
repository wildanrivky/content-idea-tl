import { UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#000' }}>
      {/* Navigasi Atas */}
      <header style={{ 
        padding: '10px 20px', 
        backgroundColor: '#111', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #333'
      }}>
        <span style={{ color: 'white', fontWeight: 'bold' }}>Content Idea TL - Premium Access</span>
        <UserButton />
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