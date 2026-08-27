import { OrderResultResponse } from "@/types/order";
import { formatOrderItemSummary, formatShippingDate, formatCurrency } from "@/lib/formatters";

export interface OrderSummaryCardProps {
    order: OrderResultResponse;
  };

export default function OrderSummaryCard({order}: OrderSummaryCardProps){
    return(
        <>
        {/* 상세 정보 테이블/목록 */}
        <div className="border-top mb-4">
              <div className="row py-3 border-bottom gx-3 gy-1 align-items-center">
                <div className="col-12 col-sm-3 text-body-secondary">상품</div>
                <div className="col-12 col-sm-9">
                  {formatOrderItemSummary(order.orderItemList)}
                </div>
              </div>

              <div className="row py-3 border-bottom gx-3 gy-1 align-items-center">
                <div className="col-12 col-sm-3 text-body-secondary">이메일</div>
                <div className="col-12 col-sm-9">{order.email}</div>
              </div>

              <div className="row py-3 border-bottom gx-3 gy-1 align-items-center">
                <div className="col-12 col-sm-3 text-body-secondary">주소</div>
                <div className="col-12 col-sm-9">{order.shippingAddress}</div>
              </div>

              <div className="row py-3 border-bottom gx-3 gy-1 align-items-center">
                <div className="col-12 col-sm-3 text-body-secondary">우편번호</div>
                <div className="col-12 col-sm-9">{order.zipCode}</div>
              </div>

              <div className="row py-3 border-bottom gx-3 gy-1 align-items-center">
                <div className="col-12 col-sm-3 text-body-secondary">
                  배송 예정일
                </div>
                <div className="col-12 col-sm-9">
                  {formatShippingDate(order.shippingDate)}
                </div>
              </div>

              <div className="row py-3 border-bottom gx-3 gy-1 align-items-center">
                <div className="col-12 col-sm-3 text-body-secondary">총금액</div>
                <div className="col-12 col-sm-9">
                  {formatCurrency(order.totalPrice)}
                </div>
              </div>
            </div>
        </>
    )
}