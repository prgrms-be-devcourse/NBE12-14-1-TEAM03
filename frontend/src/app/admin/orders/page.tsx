'use client';

import OrderTable, { Order } from "@/components/common/OrderTable";
import { useEffect, useState } from "react";

export default function AdminOrdersPage(){
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/orders/admin")
        .then((res) => res.json())
        .then((rsData) => setOrders(rsData.data));
    }, []);

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
        
        
        <OrderTable
            orders={orders}
            editPath={(orderId) => `/admin/orders/${orderId}/edit`} // 수정 페이지
            removeLabel="삭제"
            onRemove={handleDelete}
            showActions={isEditAble}
            showCustomerEmail
        />      
        </>
    );
}

