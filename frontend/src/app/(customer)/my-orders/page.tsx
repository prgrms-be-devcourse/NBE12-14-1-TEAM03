'use client'

import OrderTable from "@/components/common/OrderTable";
import { RsData, OrderResultResponse, OrderItemResponse } from "@/types/order";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/Button";
import { useState, type SubmitEvent } from "react";

export default function MyOrdersPage() {

    const [orderList, setOrderList] = useState<OrderResultResponse[]>([]);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [searchedEmail, setSearchedEmail] = useState("");

    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSearchOrders = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setEmailError("");

        const trimmed = email.trim();
        if (!trimmed) {
            setEmailError("이메일을 입력해 주세요.");
            return;
        }
        if (!EMAIL_PATTERN.test(trimmed)) {
            setEmailError("올바른 이메일 형식이 아닙니다.");
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:8080/api/orders/mypage?email=${encodeURIComponent(email)}`
            );

            const data: RsData<OrderResultResponse[]> = await res.json();

            if (!res.ok || !data.resultCode.startsWith("200")) {
                if (res.status === 400) {
                    setEmailError(data.msg ?? "이메일을 확인해 주세요.");
                    return;
                }
                alert(data.msg ?? "주문 내역 조회에 실패했습니다.")
                return;
            }

            setOrderList(data.data ?? []);
            setSearchedEmail(trimmed);
        } catch {
            alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")
        }
    }

    const handleCancelOrder = async (orderId: number) => {
        if (!window.confirm("주문을 취소하시겠습니까?")) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/orders/${orderId}`, { method: "DELETE" });


            const data: RsData<null> = await res.json();


            if (!res.ok || !data.resultCode?.startsWith("200")) {
                alert(data.msg ?? "주문 취소에 실패했습니다.");
                return;
            }

            alert(data.msg);
            setOrderList((prev) => prev.filter((order) => order.id !== orderId));
        } catch {
            alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")
        }

    }

    const isEditable = (order: OrderResultResponse) => {
        return getTodayString() <= order.shippingDate;
    }

    return (
        <>
            <PageHeader
                title="내 주문 내역"
                description="이메일로 주문 내역을 조회합니다." />
            <form
                className="border bg-white p-4 mb-4"
                onSubmit={handleSearchOrders}
                noValidate>
                <label htmlFor="order-email" className="form-label">이메일</label>
                <div>
                    <div className="d-flex gap-2">
                        <input
                            id="order-email"
                            name="email"
                            type="email"
                            className={`form-control ${emailError ? "is-invalid" : ""}`}
                            placeholder="이메일을 입력해주세요."
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                if (emailError) setEmailError("");
                            }}
                            aria-invalid={!!emailError}
                            aria-describedby={emailError ? "order-email-error" : undefined}
                        />
                        <Button type="submit" className="flex-shrink-0 text-nowrap">
                            주문 내역 조회
                        </Button>
                    </div>
                    {emailError && (
                        <div id="order-email-error" className="invalid-feedback d-block">
                            {emailError}
                        </div>
                    )}
                </div>
            </form>
            {orderList.length > 0 && (<h2 className="h6 mb-4">{searchedEmail}의 주문 내역</h2>)}
            <OrderTable
                orders={orderList}
                editPath={(orderId) => `/orders/${orderId}/edit`}
                removeLabel="취소"
                onRemove={handleCancelOrder}
                showActions={isEditable}
            />
        </>
    )
}

function getTodayString(): string {
    const now = new Date();

    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(now);
}