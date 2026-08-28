'use client';

import OrderTable from "@/components/common/OrderTable";
import PageHeader from "@/components/common/PageHeader";
import ShipmentList from "@/components/common/ShipmentList";
import Button from "@/components/ui/Button";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { MergedShipment, OrderResultResponse } from "@/types/order";
import { useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";

import { useEffect, useState } from "react";

// 로컬 시간 기준 yyyy-MM-dd
const todayStr = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().split("T")[0];
};

export default function AdminOrdersPage(){
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<OrderResultResponse[]>([]);
    const [shipments, setShipments] = useState<MergedShipment[]>([]);
    const [filter, setFilter] = useState<"all" | "today" | "date">((searchParams.get("filter") as "all" | "today" | "date") ?? "all");
    const [selectedDate, setSelectedDate] = useState(searchParams.get("date") ?? todayStr());
    const backQuery = filter === "all"
        ? "from=admin&filter=all"
        : `from=admin&filter=${filter}&date=${filter === "today" ? todayStr() : selectedDate}`;
    const [fetchError, setFetchError] = useState<{
        statusCode: number;
        message: string;
    } | null>(null);

    // 전체 주문 조회
    const fetchAllOrders = async () => {
        try {
            setFetchError(null);
            const rsData = await api<OrderResultResponse[]>("/api/orders/admin");
            setOrders(rsData.data ?? []);
        } catch (err) {
            if (err instanceof ApiError) {
                setFetchError({ statusCode: err.statusCode, message: err.message });
            } else {
                setFetchError({
                    statusCode: 500,
                    message: "주문 목록 조회에 실패했습니다.",
                });
            }
        }
    };

    // 합배송 조회
    const fetchShipments = async (date: string) => {
        try {
            setFetchError(null);
            const rsData = await api<MergedShipment[]>(
                `/api/orders/admin/shipments?shippingDate=${date}`
            );
            setShipments(rsData.data ?? []);
        } catch (err) {
            if (err instanceof ApiError) {
                setFetchError({ statusCode: err.statusCode, message: err.message });
            } else {
                setFetchError({
                    statusCode: 500,
                    message: "합배송 목록 조회에 실패했습니다.",
                });
            }
        }
    };

    useEffect(() => {
        // 전체 내역
        if (filter === "all"){
            void fetchAllOrders();
            return;
        }

        // 오늘 배송 내역
        if(filter === "today"){
            void fetchShipments(todayStr());
        }
        
        if (filter === "date"){
            fetchShipments(selectedDate);
        }

    }, [filter]);

    // 수정 가능 여부 판단
    const isEditAble = (order: OrderResultResponse) => {
        const deadline = new Date(`${order.shippingDate}T14:00:00`);
        return new Date() < deadline;
    };

    // 주문 삭제 핸들러
    const handleDelete = async (orderId: number) => {
        if (!confirm(`${orderId}번 주문을 삭제하시겠습니까?`)) return;

        try {
            const rsData = await api<null>(`/api/orders/${orderId}`, {
                method: "DELETE",
            });
            alert(rsData.msg || `${orderId}번 주문이 삭제되었습니다.`);
            setOrders((prev) => prev.filter((o) => o.id !== orderId));
        } catch (err) {
            if (err instanceof ApiError) {
                alert(err.message || "주문 삭제에 실패했습니다.");
            } else {
                alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
            }
        }
    };

    return (
        <>
        {/* 헤더 */}
        <PageHeader
                title="관리자 주문 목록"
                description="조회 기준을 선택해 주문과 합배송 목록을 관리합니다."
            />

        {/* 버튼 */}
        <div className="d-flex flex-wrap gap-2 mb-4">
            <Button
                variant={filter === "all" ? "dark" : "outline-dark"}
                onClick={() => setFilter("all")}
            >
                전체 주문
            </Button>

            <Button
                variant={filter === "today" ? "dark" : "outline-dark"}
                onClick={() => setFilter("today")}
            >
                오늘 배송
            </Button>

            <Button
                variant={filter === "date" ? "dark" : "outline-dark"}
                onClick={() => setFilter("date")}
            >
                날짜별 배송
            </Button>
        </div>

        {filter === "date" && (
            <section className="border bg-white p-4 mb-4">
                <label htmlFor="shippingDate" className="form-label">
                    배송 날짜
                </label>

                <div className="d-flex flex-wrap gap-2">
                    <input
                        id="shippingDate"
                        type="date"
                        className="form-control w-auto"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />

                    <Button onClick={() => void fetchShipments(selectedDate)}>
                        합배송 목록 조회
                    </Button>
                </div>
            </section>
        )}

        {/* 에러 화면 또는 내역 테이블 */}
        {fetchError ? (
            <ErrorDisplay
                statusCode={fetchError.statusCode}
                message={fetchError.message}
                onRetry={() => {
                    setFetchError(null);
                    if (filter === "all") void fetchAllOrders();
                    else if (filter === "today") void fetchShipments(todayStr());
                    else void fetchShipments(selectedDate);
                }}
            />
        ) : filter === "all" ? (
            <OrderTable
                orders={orders}
                detailPath={(orderId) => `/orders/${orderId}?${backQuery}`}
                editPath={(orderId) => `/orders/${orderId}/edit`}
                removeLabel="삭제"
                onRemove={handleDelete}
                showActions={isEditAble}
                showCustomerEmail
            />
        ) : (
            <ShipmentList shipments={shipments} backQuery={backQuery} />
        )}
        </>
    );
}

