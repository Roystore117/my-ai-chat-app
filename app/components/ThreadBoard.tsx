"use client";

import { useState } from "react";
import Image from "next/image";

type Post = {
  id: number;
  name: string;
  date: string;
  content: string;
  userId: string;
  likes: number;
};

// ミニわかるーボタン
function MiniWakaruButton({ likes, onLike }: { likes: number; onLike: () => void }) {
  const [showDog, setShowDog] = useState(false);

  const handleClick = () => {
    onLike();
    setShowDog(true);
    setTimeout(() => setShowDog(false), 1500);
  };

  const barWidth = Math.min(100, Math.max(5, likes * 10));

  return (
    <div className="mt-1 flex items-center gap-2">
      <div className="relative">
        {/* 犬 */}
        {showDog && (
          <div className="absolute -right-6 -top-4 animate-bounce">
            <Image src="/assistant-icon.png" alt="👍" width={24} height={24} />
            <span className="absolute -right-1 -top-1 text-xs">👍</span>
          </div>
        )}
        <button
          onClick={handleClick}
          className="rounded bg-pink-400 px-2 py-0.5 text-xs font-bold text-white hover:bg-pink-500 active:scale-95"
        >
          +
        </button>
      </div>
      <span className="text-xs font-bold text-pink-500">+{likes}</span>
      <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-300">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-500 transition-all duration-300"
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  );
}

// ランダムなIDを生成
function generateUserId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 現在の日時をフォーマット
function formatDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[now.getDay()];
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}/${month}/${day}(${weekday}) ${hours}:${minutes}:${seconds}`;
}

export default function ThreadBoard() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      name: "名無しさん",
      date: "2026/01/31(金) 00:00:00",
      content: "AIチャットアプリについて語るスレ",
      userId: "XXXXXXXX",
      likes: 0,
    },
  ]);
  const [newPost, setNewPost] = useState("");
  const [userName, setUserName] = useState("");
  const [myUserId] = useState(generateUserId());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: Post = {
      id: posts.length + 1,
      name: userName.trim() || "名無しさん",
      date: formatDate(),
      content: newPost,
      userId: myUserId,
      likes: 0,
    };

    setPosts([...posts, post]);
    setNewPost("");
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <div className="flex h-[600px] w-80 flex-col rounded-lg border border-gray-300 bg-[#EFEFEF] shadow-lg">
      {/* ヘッダー */}
      <div className="border-b border-gray-400 bg-[#800000] px-3 py-2">
        <h2 className="text-sm font-bold text-white">
          【AI】チャットアプリ総合スレ Part1
        </h2>
      </div>

      {/* スレッド表示エリア */}
      <div className="flex-1 overflow-y-auto p-2">
        {posts.map((post) => (
          <div key={post.id} className="mb-3 text-xs">
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-bold text-green-700">{post.id}</span>
              <span className="text-gray-600">：</span>
              <span className="font-bold text-green-700">{post.name}</span>
              <span className="text-gray-600">：</span>
              <span className="text-gray-500">{post.date}</span>
              <span className="text-gray-600">ID:</span>
              <span className="text-red-600">{post.userId}</span>
            </div>
            <div className="mt-1 whitespace-pre-wrap pl-2 text-gray-800">
              {post.content}
            </div>
            <div className="pl-2">
              <MiniWakaruButton likes={post.likes} onLike={() => handleLike(post.id)} />
            </div>
          </div>
        ))}
      </div>

      {/* 投稿フォーム */}
      <div className="border-t border-gray-400 bg-[#F0E0D6] p-2">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="名前"
              className="w-24 rounded border border-gray-400 px-2 py-1 text-xs"
            />
            <span className="text-xs text-gray-500 self-center">ID:{myUserId}</span>
          </div>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="本文を入力..."
            rows={2}
            className="w-full resize-none rounded border border-gray-400 px-2 py-1 text-xs"
          />
          <button
            type="submit"
            disabled={!newPost.trim()}
            className="w-full rounded bg-[#800000] px-3 py-1 text-xs font-bold text-white hover:bg-[#600000] disabled:bg-gray-400"
          >
            書き込む
          </button>
        </form>
      </div>
    </div>
  );
}
