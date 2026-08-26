"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";
import { OrderResultResponse, RsData } from "@/types/order";
import {
  formatOrderDateTime,
  formatShippingDate,
  formatCurrency,
  formatOrderItemSummary,
} from "@/lib/formatters";

// 와이어프레임 기본 목데이터 (백엔드 미구동 또는 조회 실패 시 표시)
const DEFAULT_ORDER_DATA: OrderResultResponse = {
  id: 1,
  createDate: "2026-08-26T13:42:00",
  email: "suji@example.com",
  shippingAddress: "서울시 강남구 테헤란로 00",
  zipCode: "06236",
  shippingDate: "2026-08-26",
  totalPrice: 16500,
  orderItemList: [
    {
      productId: 1,
      productName: "Columbia Nariño",
      orderPrice: 5000,
      quantity: 2,
      totalPrice: 10000,
    },
    {
      productId: 2,
      productName: "Brazil Serra",
      orderPrice: 6500,
      quantity: 1,
      totalPrice: 6500,
    },
  ],
};

export default function OrderCompletePage() {
  const params = useParams();
  const orderId = params?.id as string | undefined;
  const router = useRouter();

  const [order, setOrder] = useState<OrderResultResponse>(DEFAULT_ORDER_DATA);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/mypage/${orderId}`);
        if (response.ok) {
          const resData: RsData<OrderResultResponse> = await response.json();
          if (resData && resData.data && isMounted) {
            setOrder(resData.data);
          }
        }
      } catch {
        // 백엔드 연결 전이거나 에러 발생 시 기본 목데이터 유지
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
        ) : (
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
                onClick={() => router.push("/my-orders")}
              >
                주문 내역
              </Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
