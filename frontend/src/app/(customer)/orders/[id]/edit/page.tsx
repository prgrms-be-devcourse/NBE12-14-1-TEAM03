"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import QuantityControl from "@/components/common/QuantityControl";
import Button from "@/components/ui/Button";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import {
  OrderResultResponse,
  OrderModifyRequest,
  ProductResponse,
} from "@/types/order";
import { api, ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/formatters";

interface EditableOrderItem {
  productId: number;
  productName: string;
  photoUrl?: string;
  orderPrice: number;
  quantity: number;
}

export default function OrderEditPage() {
  const params = useParams();
  const orderId = params?.id as string | undefined;
  const router = useRouter();

  const searchParams = useSearchParams();
  const isFromAdmin = searchParams.get("from") === "admin";

  const [email, setEmail] = useState<string>("");
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [items, setItems] = useState<EditableOrderItem[]>([]);

  const [availableProducts, setAvailableProducts] = useState<ProductResponse[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<{
    statusCode: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!orderId) return;

      try {
        setLoading(true);
        setFetchError(null);

        const [prodData, orderData] = await Promise.all([
          api<ProductResponse[]>("/api/products"),
          api<OrderResultResponse>(`/api/orders/mypage/${orderId}`),
        ]);

        if (isMounted) {
          setAvailableProducts(prodData.data ?? []);
          const fetched = orderData.data;
          setEmail(fetched.email);
          setShippingAddress(fetched.shippingAddress);
          setZipCode(fetched.zipCode);
          setItems(
            fetched.orderItemList.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              photoUrl: item.photoUrl,
              orderPrice: item.orderPrice,
              quantity: item.quantity,
            }))
          );
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof ApiError) {
            setFetchError({ statusCode: err.statusCode, message: err.message });
          } else {
            setFetchError({
              statusCode: 500,
              message: "주문 또는 상품 정보를 불러오지 못했습니다.",
            });
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  // 수량 변경 핸들러
  const handleQuantityChange = (productId: number, newQty: number) => {
    if (newQty < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // 상품 삭제 핸들러
  const handleRemoveItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // 상품 추가 핸들러
  const handleAddItem = () => {
    if (!selectedProductId) return;
    const targetId = Number(selectedProductId);
    const targetProduct = availableProducts.find((p) => p.id === targetId);
    if (!targetProduct) return;

    setItems((prev) => {
      const existing = prev.find((item) => item.productId === targetId);
      if (existing) {
        return prev.map((item) =>
          item.productId === targetId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: targetProduct.id,
          productName: targetProduct.name,
          photoUrl: targetProduct.photoUrl,
          orderPrice: targetProduct.price,
          quantity: 1,
        },
      ];
    });

    setSelectedProductId("");
  };

  // 실시간 총금액 계산
  const totalPrice = items.reduce(
    (sum, item) => sum + item.orderPrice * item.quantity,
    0
  );

  //돌아갈 리스트 페이지
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

    sessionStorage.setItem("orderEmail", email);
    router.push("/my-orders");
  };

  // 주문 수정 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage("주문 상품은 최소 1개 이상이어야 합니다.");
      return;
    }

    if (!shippingAddress.trim()) {
      setErrorMessage("배송지 주소를 입력해 주세요.");
      return;
    }

    if (!zipCode.trim()) {
      setErrorMessage("우편번호를 입력해 주세요.");
      return;
    }

    const requestBody: OrderModifyRequest = {
      shippingAddress: shippingAddress.trim(),
      zipCode: zipCode.trim(),
      orderItemList: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    setIsSubmitting(true);

    try {
      if (orderId) {
        await api<OrderResultResponse>(`/api/orders/${orderId}`, {
          method: "PATCH",
          body: JSON.stringify(requestBody),
        });
        handleMoveToList()
        return;
      } else {
        // orderId가 없는 경우 orders 페이지로 이동
        router.push("/orders");
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "주문 수정 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
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

  if (loading) {
    return (
      <div className="text-center py-5 text-body-secondary border bg-white p-4">
        주문 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <>
      {/* 1. 페이지 헤더 */}
      <PageHeader
        title="주문 수정"
        description="상품 구성과 배송 정보를 함께 변경합니다."
        actions={
          <div className="d-flex flex-wrap gap-2">
            <span className="border bg-white px-3 py-1 font-monospace text-body-secondary">
              GET /orders/&#123;id&#125;
            </span>
            <span className="border bg-white px-3 py-1 font-monospace text-body-secondary">
              PATCH /orders/&#123;id&#125;
            </span>
          </div>
        }
      />

      {/* 2. 주문 상품 카드 */}
      <section className="border bg-white p-4 mb-4">
        <h2 className="h4 mb-4">주문 상품</h2>

        {items.length === 0 ? (
          <p className="text-body-secondary py-3 mb-0 border-bottom">
            선택된 주문 상품이 없습니다. 아래에서 상품을 추가해주세요.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.productId}
              className="d-flex justify-content-between align-items-center gap-3 py-3 border-bottom"
            >
              <div className="d-flex align-items-center gap-3">
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={`${item.productName} 상품 이미지`}
                    width={64}
                    height={64}
                    className="product-image"
                  />
                ) : (
                  <div
                    className="bg-body-secondary d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 64, height: 64 }}
                    aria-label="이미지 없음"
                  >
                    <span className="text-body-secondary" style={{ fontSize: "11px" }}>No Image</span>
                  </div>
                )}
                <div>
                  <p className="mb-1 fw-semibold">{item.productName}</p>
                  <p className="mb-0 text-body-secondary">{formatCurrency(item.orderPrice)}</p>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <QuantityControl
                  value={item.quantity}
                  min={1}
                  onChange={(newQty) =>
                    handleQuantityChange(item.productId, newQty)
                  }
                />
                <Button
                  variant="outline-danger"
                  onClick={() => handleRemoveItem(item.productId)}
                >
                  삭제
                </Button>
              </div>
            </div>
          ))
        )}

        {/* 상품 추가 셀렉트 및 버튼 */}
        <div className="d-flex flex-wrap gap-2 pt-3">
          <div className="flex-grow-1">
            <select
              className="form-select"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              aria-label="추가할 상품 선택"
            >
              <option value="">상품을 선택하세요</option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline-dark"
            className="text-nowrap"
            onClick={handleAddItem}
            disabled={!selectedProductId}
          >
            상품 추가
          </Button>
        </div>
      </section>

      {/* 3. 배송 정보 카드 */}
      <section className="border bg-white p-4 mb-4">
        <h2 className="h4 mb-4">배송 정보</h2>

        <form onSubmit={handleSubmit}>
          {/* 이메일 (수정 불가) */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              이메일
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              disabled
            />
          </div>

          {/* 주소 */}
          <div className="mb-3">
            <label htmlFor="shippingAddress" className="form-label">
              주소
            </label>
            <input
              id="shippingAddress"
              type="text"
              className="form-control"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
            />
          </div>

          {/* 우편번호 */}
          <div className="mb-4">
            <label htmlFor="zipCode" className="form-label">
              우편번호
            </label>
            <input
              id="zipCode"
              type="text"
              className="form-control"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
            />
          </div>

          {/* 총금액 */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span>총금액</span>
            <span className="fw-semibold fs-5">
              {formatCurrency(totalPrice)}
            </span>
          </div>

          {/* 에러 메시지 */}
          {errorMessage && (
            <div className="alert alert-danger mb-3" role="alert">
              {errorMessage}
            </div>
          )}

          {/* 변경 저장 버튼 (전체 너비) */}
          <Button
            type="submit"
            variant="dark"
            fullWidth
            disabled={isSubmitting || items.length === 0}
          >
            {isSubmitting ? "저장 중..." : "변경 저장"}
          </Button>
        </form>
      </section>
    </>
  );
}
