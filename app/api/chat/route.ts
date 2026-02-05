import OpenAI from "openai";
import { ChatCompletionMessageParam, ChatCompletionContentPart } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type InputMessage = {
  role: "user" | "assistant";
  content: string;
  image?: string;
};

export async function POST(request: Request) {
  try {
    const { messages } = await request.json() as { messages: InputMessage[] };

    // メッセージをOpenAI形式に変換
    const formattedMessages: ChatCompletionMessageParam[] = messages.map((msg) => {
      if (msg.role === "user" && msg.image) {
        // 画像付きメッセージ
        const content: ChatCompletionContentPart[] = [
          { type: "text", text: msg.content },
          { type: "image_url", image_url: { url: msg.image } }
        ];
        return { role: "user" as const, content };
      }
      return { role: msg.role, content: msg.content };
    });

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formattedMessages,
      stream: true,
      stream_options: { include_usage: true },
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        let usage = null;
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
          // トークン使用量を取得（最後のチャンクに含まれる）
          if (chunk.usage) {
            usage = chunk.usage;
          }
        }
        // ストリーム終了後にトークン情報を送信
        if (usage) {
          controller.enqueue(encoder.encode(`\n[[TOKEN_USAGE:${JSON.stringify(usage)}]]`));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
