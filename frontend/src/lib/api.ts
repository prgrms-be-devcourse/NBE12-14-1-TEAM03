import type { RsData } from "@/types/order";

/**
 * API 호출 시 발생하는 에러를 표현하는 커스텀 에러 클래스.
 *
 * - statusCode: HTTP 상태 코드 (예: 400, 404, 500)
 * - resultCode: 백엔드 RsData의 resultCode (예: "404-1")
 * - msg: 백엔드에서 전달한 에러 메시지
 * - data: 검증 에러 시 필드별 에러 정보 등
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly resultCode: string;
  public readonly data: unknown;

  constructor(statusCode: number, resultCode: string, msg: string, data?: unknown) {
    super(msg);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.resultCode = resultCode;
    this.data = data ?? null;
  }
}

/**
 * 공통 API fetch 래퍼.
 *
 * 사용 예시:
 * ```ts
 * const result = await api<ProductResponse[]>("/api/products");
 * // result.data 에 ProductResponse[] 가 들어있음
 *
 * const result = await api<OrderCreateResponse>("/api/orders", {
 *   method: "POST",
 *   body: JSON.stringify(requestBody),
 * });
 * ```
 *
 * 에러 발생 시 ApiError를 throw합니다.
 * ```ts
 * try {
 *   const result = await api<T>(url);
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.log(error.statusCode);  // 404
 *     console.log(error.message);     // "해당 ID의 주문 내역은 존재하지 않습니다."
 *     console.log(error.resultCode);  // "404-1"
 *   }
 * }
 * ```
 */
export async function api<T>(
  url: string,
  options?: RequestInit,
): Promise<RsData<T>> {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  let body: RsData<T>;

  try {
    body = await response.json();
  } catch {
    // JSON 파싱 실패 시 (백엔드가 RsData 형식이 아닌 응답을 반환한 경우)
    throw new ApiError(
      response.status,
      `${response.status}-0`,
      `서버 응답을 처리할 수 없습니다. (HTTP ${response.status})`,
    );
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      body.resultCode,
      body.msg,
      body.data,
    );
  }

  return body;
}
