"use client";

import { useState } from "react";
import Image from "next/image";

// 紙吹雪のパーティクル
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;

  const colors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181", "#AA96DA", "#FCBAD3"];
  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: "50%",
            backgroundColor: piece.color,
            width: "8px",
            height: "8px",
            borderRadius: piece.id % 2 === 0 ? "50%" : "2px",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

type WakaruButtonProps = {
  likeCount: number;
  onLike: () => void;
};

export default function WakaruButton({ likeCount, onLike }: WakaruButtonProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDog, setShowDog] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setShowConfetti(true);
    setShowDog(true);
    onLike();

    // 紙吹雪と犬を2秒後に消す
    setTimeout(() => {
      setShowConfetti(false);
      setShowDog(false);
      setIsAnimating(false);
    }, 2000);
  };

  // バーの幅を計算（最大100、最小でも少し表示）
  const barWidth = Math.min(100, Math.max(5, likeCount * 5));

  return (
    <div className="relative mt-2 flex items-center justify-start gap-3">
      {/* 紙吹雪 */}
      <Confetti active={showConfetti} />

      {/* ボタンとキャラクターのコンテナ */}
      <div className="relative">
        {/* 犬のキャラクター（ボタンの後ろから出てくる） */}
        <div
          className={`absolute -right-2 bottom-0 z-0 transition-all duration-500 ease-out ${
            showDog
              ? "translate-x-12 translate-y-0 opacity-100"
              : "translate-x-0 translate-y-4 opacity-0"
          }`}
        >
          <div className={`${showDog ? "animate-thumbs-up" : ""}`}>
            <div className="relative">
              <Image
                src="/assistant-icon.png"
                alt="わかるー！"
                width={48}
                height={48}
                className="drop-shadow-md"
              />
              {/* グッドマーク */}
              {showDog && (
                <div className="absolute -right-1 -top-1 text-2xl animate-bounce">
                  👍
                </div>
              )}
            </div>
          </div>
        </div>

        {/* わかるー！ボタン */}
        <button
          onClick={handleClick}
          disabled={isAnimating}
          className={`relative z-10 rounded-lg px-3 py-1.5 text-sm font-medium shadow-md transition-all duration-300 ${
            isAnimating
              ? "scale-95 bg-pink-400 text-white"
              : "bg-pink-400 text-white hover:bg-pink-500 hover:scale-105 active:scale-95"
          }`}
        >
          <span className="flex items-center gap-1">
            +
          </span>
        </button>
      </div>

      {/* いいねバー */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-pink-500">+{likeCount}</span>
        <div className="h-3 w-32 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-500 transition-all duration-500 ease-out"
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>

      {/* CSSアニメーション */}
      <style jsx global>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-150px) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes thumbs-up {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
        }

        .animate-confetti {
          animation: confetti ease-out forwards;
        }

        .animate-thumbs-up {
          animation: thumbs-up 0.5s ease-in-out 2;
        }
      `}</style>
    </div>
  );
}
