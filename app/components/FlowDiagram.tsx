"use client";

type FlowNodeProps = {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  color: string;
  number: number;
};

function FlowNode({ icon, label, sublabel, color, number }: FlowNodeProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full ${color}`}
        >
          {icon}
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded bg-gray-200 text-xs font-medium text-gray-600">
          {number}
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-700">{label}</div>
        <div className="text-xs text-gray-400">{sublabel}</div>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex items-center gap-1 px-2">
      <div className="h-1 w-1 rounded-full bg-gray-300" />
      <div className="h-1 w-1 rounded-full bg-gray-300" />
      <div className="h-1 w-1 rounded-full bg-gray-300" />
    </div>
  );
}

export default function FlowDiagram() {
  return (
    <div className="rounded-xl bg-white/80 p-6 shadow-lg backdrop-blur">
      <h3 className="mb-4 text-center text-sm font-semibold text-gray-600">
        Internal Flow
      </h3>
      <div className="flex flex-col items-center gap-4">
        {/* User Input */}
        <FlowNode
          icon={
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          label="User"
          sublabel="メッセージ入力"
          color="bg-gray-800"
          number={1}
        />

        <Connector />

        {/* Frontend */}
        <FlowNode
          icon={
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          }
          label="React"
          sublabel="Chat Component"
          color="bg-[#61DAFB]"
          number={2}
        />

        <Connector />

        {/* API Route */}
        <FlowNode
          icon={
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
            </svg>
          }
          label="Next.js API"
          sublabel="/api/chat"
          color="bg-purple-500"
          number={3}
        />

        <Connector />

        {/* OpenAI */}
        <FlowNode
          icon={
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          }
          label="OpenAI"
          sublabel="GPT-4o-mini"
          color="bg-[#00A67E]"
          number={4}
        />

        <Connector />

        {/* Response */}
        <FlowNode
          icon={
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          label="Stream"
          sublabel="リアルタイム応答"
          color="bg-[#00B900]"
          number={5}
        />
      </div>
    </div>
  );
}
