"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { OrderResultResponse } from "@/types/order";
import { api, ApiError } from "@/lib/api";
import {
  formatOrderDateTime,
} from "@/lib/formatters";
import OrderSummaryCard from "@/components/common/OrderSummaryCard";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string | undefined;
  const router = useRouter();

  const [order, setOrder] = useState<OrderResultResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const isCreated = searchParams.get("created") === "1";

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


  const isFromAdmin = searchParams.get("from") === "admin";

  const handleMoveToList = () => {
    if (isFromAdmin) {
      const filter = searchParams.get("filter") ?? "all";
      const date = searchParams.get("date");

      const query = date
        ? `?filter=${filter}&date=${date}`
        : `?filter=${filter}`;

      router.push(`/admin/orders${query}`);
      return;
    }

    if (!order) return;
    sessionStorage.setItem("orderEmail", order.email);
    router.push("/my-orders");
  };

  if (fetchError) {
    return (
      <ErrorDisplay
        statusCode={fetchError.statusCode}
        message={fetchError.message}
        homeHref={isFromAdmin ? "/admin/orders" : "/orders"}
      />
    );
  }

  return (
    <>
      {/* 1. 페이지 헤더 */}
      {isCreated
        ? <PageHeader
          title="주문 완료"
          description="생성된 주문 정보를 확인합니다."
          actions={
            <div className="border bg-white px-3 py-1 font-monospace text-body-secondary">
              GET /orders/&#123;id&#125;
            </div>
          }
        />
        : <PageHeader
          title="주문 상세"
          description="주문 정보를 확인합니다."
          actions={
            <div className="border bg-white px-3 py-1 font-monospace text-body-secondary">
              GET /orders/&#123;id&#125;
            </div>
          }
        />}


      {/* 2. 주문 완료 상세 카드 */}
      <section className="border bg-white p-4 p-md-5 mb-4">
        {loading ? (
          <div className="text-center py-5 text-body-secondary">
            주문 정보를 불러오는 중입니다...
          </div>
        ) : !order ? (
          <div className="text-center py-5 text-body-secondary">
            주문 정보를 불러오지 못했습니다.
          </div>
        ) : (
          <div className="mx-auto" style={{ maxWidth: "680px" }}>
            {/* 상단 체크 아이콘 */}
            {isCreated &&
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
              </div>}


            {/* 타이틀 및 주문 일시 */}
            {isCreated &&
              <h2 className="h4 fw-semibold text-center mb-2">
                주문이 완료되었습니다
              </h2>}
            <p className="text-center text-body-secondary mb-4">
              {formatOrderDateTime(order.createDate)}
            </p>

            <OrderSummaryCard order={order} />

            {/* 하단 네비게이션 버튼 */}
            <div className="d-flex justify-content-center gap-2">
            {isCreated &&
              <Button
                variant="outline-dark"
                onClick={() => router.push("/orders")}
              >
                상품 더 보기
              </Button>}

                <Button
                  variant="dark"
                  onClick={handleMoveToList}
                >
                  {isCreated ? "주문 내역" : "목록"}
                </Button>

            </div>
          </div>
        )}
      </section>
    </>
  );
}
