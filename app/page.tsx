"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Chat, { TokenUsageData } from "./components/Chat";
import FlowDiagram from "./components/FlowDiagram";
import TokenUsage from "./components/TokenUsage";
import ThreadBoard from "./components/ThreadBoard";
import Image from "next/image";

export default function Home() {
  const [latestUsage, setLatestUsage] = useState<TokenUsageData | null>(null);
  const [totalUsage, setTotalUsage] = useState({
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    requestCount: 0,
  });

  const handleTokenUsage = (usage: TokenUsageData) => {
    setLatestUsage(usage);
    setTotalUsage((prev) => ({
      promptTokens: prev.promptTokens + usage.promptTokens,
      completionTokens: prev.completionTokens + usage.completionTokens,
      totalTokens: prev.totalTokens + usage.totalTokens,
      requestCount: prev.requestCount + 1,
    }));
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-4">
      {/* ユーザーボタン（右上） */}
      <div className="absolute right-4 top-4 z-20">
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
            },
          }}
        />
      </div>

      {/* 歩くキャラクター */}
      <div className="pointer-events-none absolute bottom-8 left-0 w-full">
        <div className="animate-walk">
          <div className="animate-bounce-walk">
            <Image
              src="/walking-dog.png"
              alt="歩く犬"
              width={160}
              height={160}
              className="drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      <main className="z-10 flex w-full items-start justify-center gap-4">
        {/* 左側：2chスレッド */}
        <div className="hidden xl:block">
          <ThreadBoard />
        </div>

        {/* 中央左：チャット */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold text-zinc-900">
            AI Chat
          </h1>
          <Chat onTokenUsage={handleTokenUsage} />
        </div>

        {/* 中央：フロー図 */}
        <div className="hidden lg:block">
          <FlowDiagram />
        </div>

        {/* 右側：トークン情報 */}
        <div className="hidden xl:block">
          <TokenUsage usage={latestUsage} totalUsage={totalUsage} />
        </div>
      </main>

      <style jsx global>{`
        @keyframes walk {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(calc(100vw + 100px));
          }
        }

        @keyframes bounce-walk {
          0%, 100% {
            transform: translateY(0) rotate(-3deg);
          }
          50% {
            transform: translateY(-8px) rotate(3deg);
          }
        }

        .animate-walk {
          animation: walk 48s linear infinite;
        }

        .animate-bounce-walk {
          animation: bounce-walk 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
