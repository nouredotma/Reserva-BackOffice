import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--reserva-neutral-15)]">
      <Sidebar />
      <style>{`
        @media print {
          .sidebar { display: none !important; }
        }
      `}</style>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
