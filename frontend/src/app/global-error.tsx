"use client";

import Link from "next/link";

/**
 * 루트 레이아웃 자체가 실패했을 때의 최후의 에러 핸들러.
 * 레이아웃이 깨졌으므로 자체 <html>, <body>를 포함하며,
 * Bootstrap CDN을 직접 로드합니다.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
        />
      </head>
      <body
        className="min-vh-100"
        style={{
          background: "#f5f5f2",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <main className="container py-4">
          <section className="border bg-white p-4 text-center">
            <p className="display-1 fw-bold mb-1">500</p>

            <p className="fs-4 mb-0">
              서버 내부 오류가 발생했습니다
            </p>

            <hr />

            <p className="text-body-secondary mb-0">
              사유 : {error.message || "예기치 않은 오류가 발생했습니다."}
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={reset}
              >
                다시 시도
              </button>

              <Link href="/orders" className="btn btn-dark">
                홈으로 돌아가기
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
