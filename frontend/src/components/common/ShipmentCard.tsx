import { MergedShipment } from "@/types/order";

export default function ShipmentCard({ shipment }: { shipment: MergedShipment }) {
    return (
        <section className="border bg-white mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 p-3 bg-body-secondary">
                <div>
                    <p className="mb-1 text-body-secondary">이메일</p>
                    <p className="mb-0">{shipment.email}</p>
                </div>

                <div>
                    <p className="mb-1 text-body-secondary">배송일</p>
                    <p className="mb-0">{shipment.shippingDate.replaceAll("-", ".")}</p>
                </div>

                <div>
                    <p className="mb-1 text-body-secondary">배송지</p>
                    <p className="mb-0">{shipment.shippingAddress}</p>
                    <p className="mb-0 text-body-secondary">{shipment.zipCode}</p>
                </div>

                <div className="text-end">
                    <p className="mb-1 text-body-secondary">주문 수</p>
                    <p className="mb-0">{shipment.orderCount}건</p>
                    <p className="mb-0 text-body-secondary">
                        #{shipment.mergedOrderIds.join(", #")}
                    </p>
                </div>

                <div className="text-end">
                    <p className="mb-1 text-body-secondary">총금액</p>
                    <p className="mb-0">{shipment.totalPrice.toLocaleString("ko-KR")}원</p>
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