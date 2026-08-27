import { MergedShipment } from "@/types/order";

export default function ShipmentCard({ shipment }: { shipment: MergedShipment }) {
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
                                {shipment.mergedOrderIds.map((id) => (
                                    <span key={id} className="badge text-bg-dark">주문 #{id}</span>
                                ))}
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
                                                src={`http://localhost:8080${item.photoUrl}`}
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