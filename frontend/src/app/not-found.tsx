import ErrorDisplay from "@/components/common/ErrorDisplay";

/**
 * Next.js가 존재하지 않는 라우트 접근 시 자동으로 렌더링하는 404 페이지.
 * 루트 레벨에 위치하므로 헤더 없이 container로만 감쌉니다.
 */
export default function NotFound() {
  return (
    <main className="container py-4">
      <ErrorDisplay
        statusCode={404}
        message="요청하신 페이지를 찾을 수 없습니다."
      />
    </main>
  );
}
