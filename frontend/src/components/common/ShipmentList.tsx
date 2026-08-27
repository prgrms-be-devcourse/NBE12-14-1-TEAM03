'use client';

import { MergedShipment } from "@/types/order";
import ShipmentCard from "./ShipmentCard";

export default function ShipmentList({ shipments }: { shipments: MergedShipment[] }) {
    if (shipments.length === 0) {
        return (
            <div className="border bg-white p-5 text-center text-body-secondary">
                해당 배송일에 주문 내역이 없습니다.
            </div>
        );
    }

    return (
        <>
            <p className="mb-3">합배송 결과 · 배송 {shipments.length}건</p>

            {shipments.map((shipment) => (
                <ShipmentCard
                    key={`${shipment.email}-${shipment.zipCode}`}
                    shipment={shipment}
                />
            ))}
        </>
    );
}