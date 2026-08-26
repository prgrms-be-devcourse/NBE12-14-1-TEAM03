import { OrderItemResponse } from "@/types/order";

/**
 * 주문 생성 일시를 "YYYY년 M월 D일 HH:mm 주문" 형식으로 포맷팅합니다.
 * @param dateStr ISO 형식 일시 문자열 (예: "2026-08-26T13:42:00")
 */
export function formatOrderDateTime(dateStr?: string | null): string {
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes} 주문`;
  } catch {
    return dateStr;
  }
}

/**
 * 배송 일자를 "YYYY년 M월 D일" 형식으로 포맷팅합니다.
 * @param dateStr "YYYY-MM-DD" 또는 ISO 형식 일자 문자열
 */
export function formatShippingDate(dateStr?: string | null): string {
  if (!dateStr) return "";

  try {
    // "2026-08-26" 형태 분리 처리
    const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
    if (year && month && day) {
      return `${year}년 ${month}월 ${day}일`;
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  } catch {
    return dateStr;
  }
}

/**
 * 금액을 "16,500원" 형식으로 포맷팅합니다.
 */
export function formatCurrency(amount?: number | null): string {
  if (amount == null) return "0원";
  return `${amount.toLocaleString("ko-KR")}원`;
}

/**
 * 주문 상품 목록을 "상품명 × 수량, ..." 형식으로 요약 포맷팅합니다.
 */
export function formatOrderItemSummary(items?: OrderItemResponse[] | null): string {
  if (!items || items.length === 0) return "-";
  return items
    .map((item) => `${item.productName} × ${item.quantity}`)
    .join(", ");
}
