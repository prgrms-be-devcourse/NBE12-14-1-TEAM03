'use client';

import OrderTable from "@/components/common/OrderTable";
import PageHeader from "@/components/common/PageHeader";
import ShipmentList from "@/components/common/ShipmentList";
import Button from "@/components/ui/Button";
import { MergedShipment, OrderResultResponse } from "@/types/order";
import { useSearchParams } from "next/navigation";

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

    useEffect(() => {
        // 전체 내역
        if (filter === "all"){
            fetch("/api/orders/admin")
                .then((res) => res.json())
                .then((rsData) => setOrders(rsData.data));
            return;
        }

        // 오늘 배송 내역
        if(filter === "today"){
            fetchShipments(todayStr());
        }
        
        if (filter === "date"){
            fetchShipments(selectedDate);
        }

    }, [filter]);
    
    // 합배송 조회
    const fetchShipments = (date: string) => {
        fetch(`/api/orders/admin/shipments?shippingDate=${date}`)
                .then((res) => res.json())
                .then((rsData) => setShipments(rsData.data ?? []));
    }

    // 수정 가능 여부 판단
    const isEditAble = (order: OrderResultResponse) => {
        const deadline = new Date(`${order.shippingDate}T14:00:00`);
        return new Date() < deadline;
    }

    // 주문 삭제 핸들러
    const handleDelete = async (orderId: number) => {
        if (!confirm(`${orderId}번 주문을 삭제하시겠습니까?`)) return;
    
        await fetch(`/api/orders/${orderId}`, 
            {
                method: "DELETE"
            });
        setOrders((prev) => {
            return prev.filter((o) => {
                 return o.id !== orderId;
            });
        });
    }


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

                    <Button onClick={() => fetchShipments(selectedDate)}>
                        합배송 목록 조회
                    </Button>
                </div>
            </section>
        )}

        {/* 내역 테이블 */}
        {filter === "all" ? (
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

