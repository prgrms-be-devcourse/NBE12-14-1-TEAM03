"use client";

import ErrorDisplay from "@/components/common/ErrorDisplay";

/**
 * 루트 레벨 클라이언트 에러 바운더리.
 * 라우트 그룹 밖에서 발생한 런타임 에러를 포착합니다.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container py-4">
      <ErrorDisplay
        statusCode={500}
        message={error.message || "예기치 않은 오류가 발생했습니다."}
        onRetry={reset}
      />
    </main>
  );
}
