"use client";

import { useEffect, useState } from "react";
import type { ProductResponse } from "@/types/product";
import type { RsData } from "@/types/order";
import PageHeader from "@/components/common/PageHeader";

export default function CustomerOrderPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);

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

    <div>상품 개수: {products.length}</div>
  </>
);
}