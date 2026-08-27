"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { ProductResponse } from "@/types/product";
import type {
    OrderCreateRequest,
    OrderCreateResponse,
} from "@/types/order";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { api, ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/formatters";
import QuantityControl from "@/components/common/QuantityControl";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CustomerOrderPage() {
    const router = useRouter();

    // 서버에서 조회한 전체 상품 목록
    const [products, setProducts] = useState<ProductResponse[]>([]);

    // 상품 ID를 key로 사용해 주문할 수량을 관리
    const [selectedQuantities, setSelectedQuantities] = useState<
        Record<number, number>
    >({});

    // 주문자 및 배송 정보
    const [email, setEmail] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [fetchError, setFetchError] = useState<{
        statusCode: number;
        message: string;
    } | null>(null);

    // 페이지가 처음 열릴 때 판매 상품 목록을 조회
    useEffect(() => {
        async function fetchProducts() {
            try {
                const result = await api<ProductResponse[]>("/api/products");
                setProducts(result.data);
            } catch (error) {
                if (error instanceof ApiError) {
                    setFetchError({
                        statusCode: error.statusCode,
                        message: error.message,
                    });
                } else {
                    setFetchError({
                        statusCode: 500,
                        message: "상품 목록을 불러오지 못했습니다.",
                    });
                }
            }
        }

        fetchProducts();
    }, []);

    // 상품 추가하면 기존 수량 1
    const handleAddProduct = (productId: number) => {
        setSelectedQuantities((currentQuantities) => ({
            ...currentQuantities,
            [productId]: (currentQuantities[productId] ?? 0) + 1,
        }));
    };

    const handleQuantityChange = (
        productId: number,
        quantity: number
    ) => {
        setSelectedQuantities((currentQuantities) => ({
            ...currentQuantities,
            [productId]: quantity,
        }));
    };

    const handleRemoveProduct = (productId: number) => {
        setSelectedQuantities((currentQuantities) => {
            const nextQuantities = { ...currentQuantities };

            delete nextQuantities[productId];

            return nextQuantities;
        });
    };

    // 수량이 1개 이상인 상품만 표시
    const selectedProducts = products.filter(
        (product) => (selectedQuantities[product.id] ?? 0) > 0
    );

    // 총금액 계산
    const totalPrice = selectedProducts.reduce(
        (sum, product) =>
            sum + product.price * selectedQuantities[product.id],
        0
    );

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");

        if (selectedProducts.length === 0) {
            setErrorMessage("주문할 상품을 하나 이상 선택해 주세요.");
            return;
        }

        // 입력값 api요청
        const requestBody: OrderCreateRequest = {
            email: email.trim(),
            shippingAddress: shippingAddress.trim(),
            zipCode: zipCode.trim(),
            items: selectedProducts.map((product) => ({
                productId: product.id,
                quantity: selectedQuantities[product.id],
            })),
        };

        setIsSubmitting(true);

        try {
            const result = await api<OrderCreateResponse>("/api/orders", {
                method: "POST",
                body: JSON.stringify(requestBody),
            });

            // 주문 생성에 성공하면 생성된 주문의 완료 페이지로 이동한다.
            router.push(`/orders/${result.data.orderId}`);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "주문 생성 중 오류가 발생했습니다."
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
            />
        );
    }

    return (
        <>
            <PageHeader
                title="상품 목록"
                description="여러 상품을 담아 한 번에 주문합니다."
                actions={
                    <div className="border rounded bg-white px-3 py-2 font-monospace">
                        GET /api/products
                    </div>
                }
            />

            <section className="border bg-white">
                <div className="row g-0">
                    {/* 왼쪽 상품 목록 */}
                    <div className="col-12 col-lg-7 p-4">
                        {products.map((product) => (
                            <article
                                key={product.id}
                                className="d-flex gap-3 py-4 border-bottom"
                            >
                                {/* 상품 이미지 */}
                                {product.photoUrl ? (
                                    <Image
                                        src={product.photoUrl}
                                        alt={product.name}
                                        width={64}
                                        height={64}
                                        className="border object-fit-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div
                                        className="border d-flex align-items-center justify-content-center text-body-secondary flex-shrink-0"
                                        style={{ width: 64, height: 64 }}
                                    >
                                        IMAGE
                                    </div>
                                )}

                                {/* 상품 정보 */}
                                <div className="flex-grow-1">
                                    <h2 className="h5 mb-1">{product.name}</h2>

                                    <p className="text-body-secondary mb-0">
                                        {product.category}
                                    </p>

                                    <div className="d-flex justify-content-between align-items-end gap-3 mt-4">
                                        <span className="fs-5">
                                            {formatCurrency(product.price)}
                                        </span>

                                        <Button
                                            variant="outline-dark"
                                            onClick={() => handleAddProduct(product.id)}
                                        >
                                            추가
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* 오른쪽 주문 요약 */}
                    <aside className="col-12 col-lg-5 border-start bg-body-secondary p-4">
                        <h2 className="h4 mb-4">주문 Summary</h2>

                        {selectedProducts.length === 0 ? (
                            <p className="text-body-secondary mb-0">
                                선택한 상품이 없습니다.
                            </p>
                        ) : (
                            <div>
                                {selectedProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="d-flex align-items-center justify-content-between gap-3 py-3 border-bottom"
                                    >
                                        <span className="flex-grow-1">
                                            {product.name}
                                        </span>

                                        <QuantityControl
                                            value={selectedQuantities[product.id]}
                                            min={1}
                                            onChange={(quantity) =>
                                                handleQuantityChange(product.id, quantity)
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="btn border-0 p-0 text-dark"
                                            onClick={() => handleRemoveProduct(product.id)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 주문자 및 배송 정보 입력 */}
                        <form className="mt-4" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    이메일
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    className="form-control"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="shippingAddress" className="form-label">
                                    주소
                                </label>

                                <input
                                    id="shippingAddress"
                                    type="text"
                                    className="form-control"
                                    placeholder="배송지 주소"
                                    value={shippingAddress}
                                    onChange={(event) =>
                                        setShippingAddress(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="zipCode" className="form-label">
                                    우편번호
                                </label>

                                <input
                                    id="zipCode"
                                    type="text"
                                    className="form-control"
                                    placeholder="06236"
                                    value={zipCode}
                                    onChange={(event) => setZipCode(event.target.value)}
                                    inputMode="numeric"
                                    maxLength={5}
                                    pattern="[0-9]{5}"
                                    required
                                />
                            </div>

                            <div className="border bg-white p-3 mb-4">
                                오후 2시 이후 주문은 다음 날 배송을 시작합니다.
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span>총금액</span>

                                <strong className="fs-5">
                                    {formatCurrency(totalPrice)}
                                </strong>
                            </div>

                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                disabled={isSubmitting || selectedProducts.length === 0}
                            >
                                {isSubmitting ? "주문 처리 중..." : "주문하기"}
                            </Button>

                            <div className="mt-3">
                                <span className="border bg-white px-3 py-2 font-monospace text-body-secondary">
                                    POST /api/orders
                                </span>
                            </div>
                        </form>
                    </aside>
                </div>
            </section>
        </>
    );
}
