"use client";

import { useEffect, useState } from "react";
import type { ProductResponse } from "@/types/product";
import type { RsData } from "@/types/order";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/formatters";
import QuantityControl from "@/components/common/QuantityControl";

export default function CustomerOrderPage() {
    const [products, setProducts] = useState<ProductResponse[]>([]);

    const [selectedQuantities, setSelectedQuantities] = useState<
        Record<number, number>
    >({});

    const [email, setEmail] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [zipCode, setZipCode] = useState("");

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/products"
                );

                if (!response.ok) {
                    throw new Error("상품 목록을 불러오지 못했습니다.");
                }

                const result: RsData<ProductResponse[]> =
                    await response.json();

                setProducts(result.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchProducts();
    }, []);

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


    const selectedProducts = products.filter(
        (product) => (selectedQuantities[product.id] ?? 0) > 0
    );

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
                                {/* 상품 이미지 임시 영역 */}
                                <div className="border d-flex align-items-center justify-content-center flex-shrink-0 p-3 text-body-secondary">
                                    IMAGE
                                </div>

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
                    <aside className="col-12 col-lg-5 border-start bg-body-tertiary p-4">
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

                        <form className="mt-4">
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
                        </form>
                    </aside>
                </div>
            </section>
        </>
    );
}
