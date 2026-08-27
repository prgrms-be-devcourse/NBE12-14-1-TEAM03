'use client';

import OrderTable, { Order } from "@/components/common/OrderTable";
import PageHeader from "@/components/common/PageHeader";
import ShipmentCard from "@/components/common/ShipmentCard";
import ShipmentItemTable from "@/components/common/ShipmentCard";
import ShipmentList from "@/components/common/ShipmentList";
import Button from "@/components/ui/Button";
import { MergedShipment } from "@/types/order";

import { useEffect, useState } from "react";

export default function AdminOrdersPage(){
    const [orders, setOrders] = useState<Order[]>([]);
    const [shipments, setShipments] = useState<MergedShipment[]>([]);
    const [filter, setFilter] = useState<"all" | "today" | "date">("all");

    useEffect(() => {
        // 전체 내역
        if (filter === "all"){
            fetch("http://localhost:8080/api/orders/admin")
                .then((res) => res.json())
                .then((rsData) => setOrders(rsData.data));
            return;
        }

        // 오늘 배송 내역
        if(filter === "today"){
            const today = new Date().toISOString().split("T")[0];

            fetch(`http://localhost:8080/api/orders/admin/shipments?shippingDate=${today}`)
                .then((res) => res.json())
                .then((rsData) => setShipments(rsData.data ?? []));
        }

    }, [filter]);
        

    // 수정 가능 여부 판단
    const isEditAble = (order: Order) => {
        const deadline = new Date(`${order.shippingDate}T14:00:00`);
        return new Date() < deadline;
    }

    // 주문 삭제 핸들러
    const handleDelete = async (orderId: number) => {
        if (!confirm(`${orderId}번 주문을 삭제하시겠습니까?`)) return;
    
        await fetch(`http://localhost:8080/api/orders/${orderId}`, 
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
        <PageHeader
                title="관리자 주문 목록"
                description="조회 기준을 선택해 주문과 합배송 목록을 관리합니다."
            />

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
        
        {filter === "all" ? (
            <OrderTable
                orders={orders}
                editPath={(orderId) => `/admin/orders/${orderId}/edit`}
                removeLabel="삭제"
                onRemove={handleDelete}
                showActions={isEditAble}
                showCustomerEmail
            />
        ) : (
            <ShipmentList shipments={shipments} />
        )}
        </>
    );
}

