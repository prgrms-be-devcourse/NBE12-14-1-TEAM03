"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { OrderResultResponse } from "@/types/order";
import { api, ApiError } from "@/lib/api";
import {
  formatOrderDateTime,
  formatShippingDate,
  formatCurrency,
  formatOrderItemSummary,
} from "@/lib/formatters";

export default function OrderCompletePage() {
  const params = useParams();
  const orderId = params?.id as string | undefined;
  const router = useRouter();

  const [order, setOrder] = useState<OrderResultResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<{
    statusCode: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      if (!orderId) return;

      try {
        setLoading(true);
        setFetchError(null);
        const resData = await api<OrderResultResponse>(`/api/orders/mypage/${orderId}`);
        if (isMounted) {
          setOrder(resData.data);
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof ApiError) {
            setFetchError({ statusCode: err.statusCode, message: err.message });
          } else {
            setFetchError({
              statusCode: 500,
              message: "주문 정보를 불러오지 못했습니다.",
            });
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleMoveToMyOrders = () => {
    if (order) {
      sessionStorage.setItem("orderEmail", order.email);
    }
    router.push("/my-orders");
  };

  if (fetchError) {
    return (
      <ErrorDisplay
        statusCode={fetchError.statusCode}
        message={fetchError.message}
      />
    );
  }

  return (
    <>
      {/* 1. 페이지 헤더 */}
      <PageHeader
        title="주문 완료"
        description="생성된 주문 정보를 확인합니다."
        actions={
          <div className="border bg-white px-3 py-1 font-monospace text-body-secondary">
            GET /orders/&#123;id&#125;
          </div>
        }
      />

      {/* 2. 주문 완료 상세 카드 */}
      <section className="border bg-white p-4 p-md-5 mb-4">
        {loading ? (
          <div className="text-center py-5 text-body-secondary">
            주문 정보를 불러오는 중입니다...
          </div>
        ) : order ? (
          <div className="mx-auto" style={{ maxWidth: "680px" }}>
            {/* 상단 체크 아이콘 */}
            <div
              className="border border-dark rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: "52px", height: "52px" }}
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* 타이틀 및 주문 일시 */}
            <h2 className="h4 fw-semibold text-center mb-2">
              주문이 완료되었습니다
            </h2>
            <p className="text-center text-body-secondary mb-4">
              {formatOrderDateTime(order.createDate)}
            </p>

            {/* 상세 정보 테이블/목록 */}
            <div className="border-top mb-4">
              <div className="row py-3 border-bottom gx-3 gy-1 align-items-center">
                <div className="col-12 col-sm-3 text-body-secondary">상품</div>
                <div className="col-12 col-sm-9">
                  {formatOrderItemSummary(order.orderItemList)}
                </div>
              </div>

              <div className="row py-3 border-bottom gx-3 gy-1 align-items-center">
                <div className="col-12 col-sm-3 text-body-secondary">이메일</div>
                <div className="col-12 col-sm-9">{order.email}</div>
              </div>

              <div className="row py-3 border-bottom gx-3 gy-1 align-items-center">
                <div className="col-12 col-sm-3 text-body-secondary">주소</div>
                <div className="col-12 col-sm-9">{order.shippingAddress}</div>
              </div>

              <div className="row py-3 border-bottom gx-3 gy-1 align-items-center">
                <div className="col-12 col-sm-3 text-body-secondary">우편번호</div>
                <div className="col-12 col-sm-9">{order.zipCode}</div>
              </div>

              <div className="row py-3 border-bottom gx-3 gy-1 align-items-center">
                <div className="col-12 col-sm-3 text-body-secondary">
                  배송 예정일
                </div>
                <div className="col-12 col-sm-9">
                  {formatShippingDate(order.shippingDate)}
                </div>
              </div>

              <div className="row py-3 border-bottom gx-3 gy-1 align-items-center">
                <div className="col-12 col-sm-3 text-body-secondary">총금액</div>
                <div className="col-12 col-sm-9">
                  {formatCurrency(order.totalPrice)}
                </div>
              </div>
            </div>

            {/* 하단 네비게이션 버튼 */}
            <div className="d-flex justify-content-center gap-2">
              <Button
                variant="outline-dark"
                onClick={() => router.push("/orders")}
              >
                상품 더 보기
              </Button>
              <Button
                variant="dark"
                onClick={handleMoveToMyOrders}
              >
                주문 내역
              </Button>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
