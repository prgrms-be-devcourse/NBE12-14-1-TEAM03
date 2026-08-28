"use client";

import { useEffect, useState } from "react";
import { ProductResponse } from "@/types/product";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { api, ApiError } from "@/lib/api";

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [fetchError, setFetchError] = useState<{
        statusCode: number;
        message: string;
    } | null>(null);

    const fetchProducts = async () => {
        try {
            setFetchError(null);
            const result = await api<ProductResponse[]>("/api/products");
            setProducts(result.data ?? []);
        } catch (error) {
            if (error instanceof ApiError) {
                setFetchError({
                    statusCode: error.statusCode,
                    message: error.message,
                });
            } else {
                setFetchError({
                    statusCode: 500,
                    message: "상품 목록 조회에 실패했습니다.",
                });
            }
        }
    };

    useEffect(() => {
        void fetchProducts();
    }, []);

    function formatDateTime(dateTime: string | null) {
        if (!dateTime) {
            return "-";
        }

        return dateTime.replace("T", " ").slice(0, 16);
    }

    return (
        <>
            <PageHeader
                title="상품 목록"
                description="상품 이미지와 생성·수정 시각을 함께 확인합니다."
                actions={
                    <Button onClick={() => router.push("/admin/products/create")}>
                        + 상품 생성
                    </Button>
                }
            />

            {fetchError ? (
                <ErrorDisplay
                    statusCode={fetchError.statusCode}
                    message={fetchError.message}
                    onRetry={() => void fetchProducts()}
                />
            ) : (
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                        <tr>
                            <th scope="col">상품 이미지</th>
                            <th scope="col">상품명</th>
                            <th scope="col">카테고리</th>
                            <th scope="col" className="text-start text-nowrap">
                                가격
                            </th>
                            <th scope="col" className="text-nowrap">
                                생성일
                            </th>
                            <th scope="col" className="text-nowrap">
                                수정일
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    {product.photoUrl ? (
                                        <img
                                            src={product.photoUrl}
                                            alt={`${product.name} 상품 이미지`}
                                            width="64"
                                            height="64"
                                            style={{ objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div
                                            className="border d-flex align-items-center justify-content-center text-body-secondary"
                                            style={{ width: "64px", height: "64px" }}
                                        >
                                            IMAGE
                                        </div>
                                    )}
                                </td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td className="text-start text-nowrap">
                                    {product.price.toLocaleString("ko-KR")}원
                                </td>
                                <td className="text-nowrap">
                                    {formatDateTime(product.createDate)}
                                </td>
                                <td className="text-nowrap">
                                    {formatDateTime(product.modifyDate)}
                                </td>
                            </tr>
                        ))}
                        </tbody>

                    </table>
                </div>
            )}
        </>
    );
}