'use client';

import { MergedShipment } from "@/types/order";
import Link from "next/link";
import { useState } from "react";

export default function ShipmentCard({ shipment }: { shipment: MergedShipment }) {
    const [expanded, setExpanded] = useState(false);
    
    const visibleIds = expanded ? shipment.mergedOrderIds : shipment.mergedOrderIds.slice(0, 3);

    return (
        <section className="border bg-white mb-4">
            <div className="p-3 bg-body-secondary">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                    <span className="fw-semibold">{shipment.email}</span>
                    <span className="text-body-secondary">·</span>
                    <span>{shipment.shippingDate.replaceAll("-", ".")} 배송</span>
                </div>

                <div className="row g-3">
                    <div className="col-md-5">
                        <p className="mb-1 text-body-secondary">배송지</p>
                        <p className="mb-0">{shipment.shippingAddress} ({shipment.zipCode})</p>
                    </div>

                    <div className="col-md-4">
                        <p className="mb-1 text-body-secondary">주문 수</p>
                            <div className="d-flex flex-wrap align-items-center gap-2">
                                <span>{shipment.orderCount}건</span>

                                <div className="d-flex flex-wrap gap-1">
                                    {visibleIds.map((id) => (
                                        <Link 
                                            key={id} href={`/orders/${id}/edit`}    // TODO: 상세 페이지로 나중에 변경
                                            className="badge text-bg-dark text-decoration-none">
                                            주문 #{id}
                                        </Link>
                                    ))}

                                    {shipment.mergedOrderIds.length > 3 && (
                                        <button
                                            type="button"
                                            className="badge text-bg-secondary border-0"
                                            onClick={() => setExpanded(!expanded)}
                                        >
                                            {expanded ? "접기" : `외 ${shipment.mergedOrderIds.length - 3}건`}
                                        </button>
                                    )}
                                </div>
                            </div>
                    </div>

                    <div className="col-md-3 text-md-end">
                        <p className="mb-1 text-body-secondary">총금액</p>
                        <p className="mb-0 fw-semibold">{shipment.totalPrice.toLocaleString("ko-KR")}원</p>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th scope="col">상품</th>
                            <th scope="col" className="text-end">수량</th>
                            <th scope="col" className="text-end">상품별 합계</th>
                        </tr>
                    </thead>

                    <tbody>
                        {shipment.orderItemList.map((item) => (
                            <tr key={item.productId}>
                                <td>
                                    <div className="d-flex align-items-center gap-3">
                                        {item.photoUrl ? (
                                            <img
                                                src={item.photoUrl}
                                                alt={`${item.productName} 상품 이미지`}
                                                className="product-image"
                                            />
                                        ) : (
                                            <div className="product-image bg-body-secondary" />
                                        )}
                                        <span>{item.productName}</span>
                                    </div>
                                </td>
                                <td className="text-end">{item.quantity}</td>
                                <td className="text-end">
                                    {item.totalPrice.toLocaleString("ko-KR")}원
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
} 