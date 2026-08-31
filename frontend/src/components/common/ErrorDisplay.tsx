"use client";

import Button from "@/components/ui/Button";
import { usePathname, useRouter } from "next/navigation";

/**
 * HTTP 상태 코드별 한글 요약 매핑.
 */
const STATUS_MESSAGES: Record<number, string> = {
  400: "잘못된 요청입니다",
  401: "인증이 필요합니다",
  403: "접근 권한이 없습니다",
  404: "페이지를 찾을 수 없습니다",
  405: "허용되지 않는 요청 방법입니다",
  408: "요청 시간이 초과되었습니다",
  409: "요청이 충돌했습니다",
  500: "서버 내부 오류가 발생했습니다",
  502: "서버 연결에 실패했습니다",
  503: "서비스를 일시적으로 사용할 수 없습니다",
};

interface ErrorDisplayProps {
  /** HTTP 상태 코드 (400, 404, 500 등) */
  statusCode: number;
  /** 백엔드에서 전달한 사유 메시지 (RsData.msg) */
  message?: string;
  /** "다시 시도" 콜백. error.tsx의 reset 함수를 전달합니다. */
  onRetry?: () => void;
  homeHref?: string;
}

/**
 * 에러 상태를 시각적으로 표시하는 공통 컴포넌트.
 *
 * - 에러 코드를 크게 표시
 * - 한글 요약 표시
 * - 백엔드 사유 메시지 표시
 * - "이전 페이지로 돌아가기" + "홈으로 돌아가기" 버튼
 */
export default function ErrorDisplay({
  statusCode,
  message,
  onRetry,
  homeHref,
}: ErrorDisplayProps) {
  const router = useRouter();
  const pathname = usePathname();

  const defaultHomeHref = pathname.startsWith("/admin")
    ? "/admin/orders"
    : "/orders";

  const resolvedHomeHref = homeHref ?? defaultHomeHref;

  const statusMessage =
    STATUS_MESSAGES[statusCode] ?? "알 수 없는 오류가 발생했습니다";

  return (
    <section className="border bg-white p-4 text-center">
      <p className="display-1 fw-bold mb-1">{statusCode}</p>

      <p className="fs-4 mb-0">{statusMessage}</p>

      {message && (
        <>
          <hr />
          <p className="text-body-secondary mb-0">사유 : {message}</p>
        </>
      )}

      <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
        {onRetry && (
          <Button variant="outline-dark" onClick={onRetry}>
            다시 시도
          </Button>
        )}

        <Button variant="outline-dark" onClick={() => router.back()}>
          이전 페이지로 돌아가기
        </Button>

        <Button onClick={() => router.push(resolvedHomeHref)}>
          홈으로 돌아가기
        </Button>
      </div>
    </section>
  );
}
