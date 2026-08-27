'use client'

import Link from "next/link";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";
import { OrderItemResponse, OrderResultResponse } from "@/types/order";

export interface OrderTableProps {
  orders: OrderResultResponse[];
  editPath: (orderId: number) => string;
  removeLabel?: "취소" | "삭제";
  onRemove: (orderId: number) => void;
  showActions?: (order: OrderResultResponse) => boolean;
  showCustomerEmail?: boolean;
};

export default function OrderTable({
  orders,
  editPath,
  removeLabel = "취소",
  onRemove,
  showActions = () => true,
  showCustomerEmail = false,
}: OrderTableProps) {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <div className="border bg-white p-5 text-center text-body-secondary">
        주문 내역이 없습니다.
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col" className="text-nowrap">
              주문 날짜
            </th>
            {showCustomerEmail && (
              <th scope="col" className="text-nowrap">
                고객 이메일
              </th>
            )}

            <th scope="col">상품</th>
            <th scope="col" className="text-end text-nowrap">
              총금액
            </th>
            <th scope="col" className="text-nowrap">
              배송 예정일
            </th>
            <th scope="col" className="text-nowrap">
              관리
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => {
            const canManage = showActions(order);

            return (
              <tr key={order.id}>

                {/* 주문 날짜 */}
                <td className="text-nowrap">
                  {formatDateTime(order.createDate)}
                </td>

                {/* 이메일 */}
                {showCustomerEmail && (
                  <td className="text-nowrap">
                    {order.email}
                  </td>
                )}

                {/* 상품 */}
                <td>
                  <Link 
                    href={`/orders/${order.id}`}
                    className="text-dark">
                    {formatProductSummary(order.orderItemList)}
                  </Link>
                </td>

                {/* 총 금액 */}
                <td className="text-end text-nowrap">
                  {formatPrice(order.totalPrice)}
                </td>

                {/* 배송 예정일 */}
                <td className="text-nowrap">
                  {formatShippingDate(order.shippingDate)}
                </td>

                {/* 관리 */}
                <td>
                  {canManage ? (
                    <div className="d-flex justify-content-end gap-2">

                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => router.push(editPath(order.id))}
                      >
                        수정
                      </Button>

                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => onRemove(order.id)}>{removeLabel}</Button>
                    </div>
                  ) : (
                    <span className="text-body-secondary d-flex justify-content-center gap-2">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatProductSummary(orderItems: OrderItemResponse[]): string {
  if (orderItems.length === 0) {
    return "상품 없음";
  }

  const firstItem = orderItems[0];
  const firstProduct = `${firstItem.productName} x ${firstItem.quantity}`;
  const additionalCount = orderItems.length - 1;

  if (additionalCount === 0) {
    return firstProduct;
  }

  return `${firstProduct} 외 ${additionalCount}건`;
}

function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

function formatDateTime(dateTime: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(new Date(dateTime))
    .replace(/\. /g, ".")
    .replace(/\.$/, "");
}

function formatShippingDate(date: string): string {
  return date.replaceAll("-", ".");
}

/*
사용 예시

<OrderTable
orders={orders.data}
editPath={(orderId) => `/orders/${orderId}/edit`}
removeLabel="취소"
onRemove={handleCancelOrder}
showActions={isEditable}
showCustomerEmail
/>
 */