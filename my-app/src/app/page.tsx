import KanbanBoard from "@/components/KanbanBoard";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-6">
      {/* Animated gradient background */}
      <div className="gradient-bg" />

      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Floating decorative orbs */}
      <div
        className="fixed w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0, 245, 212, 0.4) 0%, transparent 60%)",
          filter: "blur(80px)",
          top: "10%",
          left: "5%",
          animation: "float 12s ease-in-out infinite",
        }}
      />
      <div
        className="fixed w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(155, 93, 229, 0.5) 0%, transparent 60%)",
          filter: "blur(60px)",
          bottom: "15%",
          right: "10%",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      />
      <div
        className="fixed w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(241, 91, 181, 0.4) 0%, transparent 60%)",
          filter: "blur(50px)",
          top: "60%",
          left: "60%",
          animation: "float 14s ease-in-out infinite 2s",
        }}
      />

      {/* Main content */}
      <KanbanBoard />
    </main>
  );
}
