"use client";

type TokenUsageProps = {
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  } | null;
  totalUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    requestCount: number;
  };
};

export default function TokenUsage({ usage, totalUsage }: TokenUsageProps) {
  // GPT-4o-miniの料金 (per 1M tokens)
  const inputPrice = 0.15; // $0.15 per 1M input tokens
  const outputPrice = 0.6; // $0.60 per 1M output tokens

  const calculateCost = (prompt: number, completion: number) => {
    const inputCost = (prompt / 1_000_000) * inputPrice;
    const outputCost = (completion / 1_000_000) * outputPrice;
    return inputCost + outputCost;
  };

  const totalCost = calculateCost(totalUsage.promptTokens, totalUsage.completionTokens);

  return (
    <div className="rounded-xl bg-white/80 p-6 shadow-lg backdrop-blur">
      <h3 className="mb-4 text-center text-sm font-semibold text-gray-600">
        Token Usage
      </h3>

      {/* 最新のリクエスト */}
      <div className="mb-4 rounded-lg bg-blue-50 p-3">
        <div className="mb-2 text-xs font-medium text-blue-600">Latest Request</div>
        {usage ? (
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Input:</span>
              <span className="font-mono text-gray-700">{usage.promptTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Output:</span>
              <span className="font-mono text-gray-700">{usage.completionTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-1">
              <span className="text-gray-600">Total:</span>
              <span className="font-mono font-medium text-gray-800">{usage.totalTokens.toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-400">No data yet</div>
        )}
      </div>

      {/* 累計 */}
      <div className="rounded-lg bg-green-50 p-3">
        <div className="mb-2 text-xs font-medium text-green-600">Session Total</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Requests:</span>
            <span className="font-mono text-gray-700">{totalUsage.requestCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Input:</span>
            <span className="font-mono text-gray-700">{totalUsage.promptTokens.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Output:</span>
            <span className="font-mono text-gray-700">{totalUsage.completionTokens.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-green-200 pt-1">
            <span className="text-gray-600">Total:</span>
            <span className="font-mono font-medium text-gray-800">{totalUsage.totalTokens.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 推定コスト */}
      <div className="mt-4 rounded-lg bg-yellow-50 p-3">
        <div className="mb-1 text-xs font-medium text-yellow-600">Estimated Cost</div>
        <div className="text-center text-lg font-bold text-gray-800">
          ${totalCost.toFixed(6)}
        </div>
        <div className="mt-1 text-center text-xs text-gray-400">
          GPT-4o-mini pricing
        </div>
      </div>
    </div>
  );
}
