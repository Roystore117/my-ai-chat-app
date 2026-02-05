"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import WakaruButton from "./WakaruButton";

type Message = {
  role: "user" | "assistant";
  content: string;
  image?: string; // Base64画像データ
};

export type TokenUsageData = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

type ChatProps = {
  onTokenUsage?: (usage: TokenUsageData) => void;
};

// トークン情報を抽出するヘルパー関数
function extractTokenUsage(text: string): { content: string; usage: TokenUsageData | null } {
  const match = text.match(/\n?\[\[TOKEN_USAGE:(.+?)\]\]$/);
  if (match) {
    try {
      const usageData = JSON.parse(match[1]);
      return {
        content: text.replace(match[0], ""),
        usage: {
          promptTokens: usageData.prompt_tokens,
          completionTokens: usageData.completion_tokens,
          totalTokens: usageData.total_tokens,
        },
      };
    } catch {
      return { content: text, usage: null };
    }
  }
  return { content: text, usage: null };
}

export default function Chat({ onTokenUsage }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // 音声認識の初期化
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "ja-JP";
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");
          setInput(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("お使いのブラウザは音声認識に対応していません");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("API error");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      const assistantMessage: Message = { role: "assistant", content: "" };
      setMessages([...newMessages, assistantMessage]);

      let fullContent = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        fullContent += text;

        // トークン情報を抽出
        const { content, usage } = extractTokenUsage(fullContent);
        assistantMessage.content = content;
        setMessages([...newMessages, { ...assistantMessage }]);

        if (usage && onTokenUsage) {
          onTokenUsage(usage);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "エラーが発生しました。" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isLoading) return;

    // ファイルをBase64に変換
    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const base64 = event.target?.result as string;

      const userMessage: Message = {
        role: "user",
        content: "この画像について教えてください",
        image: base64
      };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages }),
        });

        if (!response.ok) throw new Error("API error");

        const streamReader = response.body?.getReader();
        const decoder = new TextDecoder();

        const assistantMessage: Message = { role: "assistant", content: "" };
        setMessages([...newMessages, assistantMessage]);

        let fullContent = "";
        while (streamReader) {
          const { done, value } = await streamReader.read();
          if (done) break;

          const text = decoder.decode(value);
          fullContent += text;

          // トークン情報を抽出
          const { content, usage } = extractTokenUsage(fullContent);
          assistantMessage.content = content;
          setMessages([...newMessages, { ...assistantMessage }]);

          if (usage && onTokenUsage) {
            onTokenUsage(usage);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setMessages([
          ...newMessages,
          { role: "assistant", content: "エラーが発生しました。" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fileReader.readAsDataURL(file);

    // inputをリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex h-[600px] w-full max-w-md flex-col overflow-hidden rounded-2xl shadow-xl">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 bg-[#00B900] px-4 py-3">
        <button className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-white">
            <Image src="/assistant-icon.png" alt="AI" width={40} height={40} className="object-cover" />
          </div>
          <span className="text-lg font-semibold text-white">AIアシスタント</span>
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto bg-[#7ACDBD] p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-white/70">
            メッセージを入力してください
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* アシスタントのアイコン */}
                {message.role === "assistant" && (
                  <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-white">
                    <Image src="/assistant-icon.png" alt="AI" width={32} height={32} className="object-cover" />
                  </div>
                )}

                {/* 吹き出し */}
                <div className="relative max-w-[70%]">
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-[#00B900] text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="送信画像"
                        className="mb-2 max-w-full rounded-lg"
                      />
                    )}
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>
                  {/* 吹き出しの三角形 */}
                  <div
                    className={`absolute top-3 h-0 w-0 ${
                      message.role === "user"
                        ? "right-[-6px] border-y-[6px] border-l-[8px] border-y-transparent border-l-[#00B900]"
                        : "left-[-6px] border-y-[6px] border-r-[8px] border-y-transparent border-r-white"
                    }`}
                  />
                  {/* 最新のアシスタントメッセージにのみ「わかるー！」ボタンを表示 */}
                  {message.role === "assistant" &&
                    !isLoading &&
                    index === messages.length - 1 && (
                      <WakaruButton
                        key={`wakaru-${index}`}
                        likeCount={likeCount}
                        onLike={() => setLikeCount((prev) => prev + 1)}
                      />
                    )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2">
                <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-white">
                  <Image src="/assistant-icon.png" alt="AI" width={32} height={32} className="object-cover" />
                </div>
                <div className="relative">
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                  <div className="absolute left-[-6px] top-3 h-0 w-0 border-y-[6px] border-r-[8px] border-y-transparent border-r-white" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 入力エリア */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 bg-[#F7F7F7] px-3 py-2"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "聞いています..." : "メッセージを入力"}
          disabled={isLoading}
          className="flex-1 rounded-full border-none bg-white px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B900] disabled:opacity-50"
        />
        {/* マイクボタン */}
        <button
          type="button"
          onClick={toggleListening}
          disabled={isLoading}
          className={`rounded-full p-2 transition-colors ${
            isListening
              ? "animate-pulse bg-red-500 text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          } disabled:opacity-50`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-full bg-[#00B900] p-2 text-white transition-colors hover:bg-[#009900] disabled:bg-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
