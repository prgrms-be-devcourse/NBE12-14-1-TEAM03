"use client";

import ErrorDisplay from "@/components/common/ErrorDisplay";

/**
 * 관리자 영역 에러 바운더리.
 * admin 라우트 그룹 내에서 발생한 에러를 포착하며,
 * AdminHeader는 layout.tsx에 의해 유지됩니다.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      statusCode={500}
      message={error.message || "예기치 않은 오류가 발생했습니다."}
      onRetry={reset}
      homeHref="/admin/orders"
    />
  );
}
