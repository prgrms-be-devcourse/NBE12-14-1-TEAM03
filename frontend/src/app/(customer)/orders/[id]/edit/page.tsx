"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import QuantityControl from "@/components/common/QuantityControl";
import Button from "@/components/ui/Button";
import {
  OrderResultResponse,
  OrderModifyRequest,
  ProductResponse,
  RsData,
} from "@/types/order";
import { formatCurrency } from "@/lib/formatters";

// 와이어프레임 기본 주문 목데이터
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
      photoUrl: "/images/columbia-narino.png",
      orderPrice: 5000,
      quantity: 2,
      totalPrice: 10000,
    },
    {
      productId: 2,
      productName: "Brazil Serra Do Caparaó",
      photoUrl: "/images/brazil-serra.png",
      orderPrice: 6000,
      quantity: 1,
      totalPrice: 6000,
    },
  ],
  modifiable: false
};

// 와이어프레임 기본 상품 목록 목데이터
const DEFAULT_PRODUCTS: ProductResponse[] = [
  { id: 1, name: "Columbia Nariñó", price: 5000, category: "커피콩", photoUrl: "/images/columbia-narino.png" },
  { id: 2, name: "Brazil Serra Do Caparaó", price: 6000, category: "커피콩", photoUrl: "/images/brazil-serra.png" },
  { id: 3, name: "Ethiopia Sidamo", price: 5500, category: "커피콩", photoUrl: "/images/ethiopia-sidamo.png" },
  { id: 4, name: "Columbia Quindío", price: 8000, category: "커피콩", photoUrl: "/images/columbia-quindio.png" },
];

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

  const [email, setEmail] = useState<string>(DEFAULT_ORDER_DATA.email);
  const [shippingAddress, setShippingAddress] = useState<string>(
    DEFAULT_ORDER_DATA.shippingAddress
  );
  const [zipCode, setZipCode] = useState<string>(DEFAULT_ORDER_DATA.zipCode);
  const [items, setItems] = useState<EditableOrderItem[]>(
    DEFAULT_ORDER_DATA.orderItemList.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      orderPrice: item.orderPrice,
      quantity: item.quantity,
    }))
  );

  const [availableProducts, setAvailableProducts] =
    useState<ProductResponse[]>(DEFAULT_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      // 1. 상품 목록 조회
      try {
        const prodRes = await fetch("/api/products");
        if (prodRes.ok) {
          const prodData: RsData<ProductResponse[]> = await prodRes.json();
          if (prodData && prodData.data && isMounted) {
            setAvailableProducts(prodData.data);
          }
        }
      } catch {
        // 기본 상품 목데이터 유지
      }

      // 2. 기존 주문 정보 조회
      if (orderId) {
        try {
          const orderRes = await fetch(`/api/orders/mypage/${orderId}`);
          if (orderRes.ok) {
            const orderData: RsData<OrderResultResponse> =
              await orderRes.json();
            if (orderData && orderData.data && isMounted) {
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
          }
        } catch {
          // 기본 목데이터 유지
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
        const res = await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (res.ok) {
          router.push(`/orders/${orderId}`); //TODO: 목록으로 이동(관리자, 사용자 분기 처리)
          return;
        } else {
          const errData = await res.json().catch(() => null);
          setErrorMessage(
            errData?.msg || "주문 수정 중 오류가 발생했습니다."
          );
        }
      } else {
        // orderId가 없는 경우 orders 페이지로 이동
        router.push("/orders");
      }
    } catch {
      // API 통신 실패 시에도 데모 경험을 위해 상세 페이지로 이동
      if (orderId) {
        router.push(`/orders/${orderId}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
