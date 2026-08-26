'use client'

import OrderTable from "@/components/common/OrderTable";

export default function MyOrdersPage(){
    const mockOrders = {
        resultCode: "SUCCESS",
        msg: "주문 목록 조회에 성공했습니다.",
        data: [
          {
            id: 1,
            createDate: "2026-08-26T13:42:00",
            modifyDate: "2026-08-26T13:42:00",
            email: "suji@example.com",
            shippingAddress: "서울시 강남구 테헤란로 00",
            zipCode: "06236",
            totalPrice: 16500,
            shippingDate: "2026-08-27",
            orderItemList: [
              {
                productId: 1,
                productName: "Columbia Nariño",
                photoUrl: "/images/columbia-narino.jpg",
                orderPrice: 5000,
                quantity: 2,
                totalPrice: 10000,
              },
              {
                productId: 2,
                productName: "Brazil Serra Do Caparaó",
                photoUrl: "/images/brazil-serra.jpg",
                orderPrice: 6500,
                quantity: 1,
                totalPrice: 6500,
              },
            ],
          },
          {
            id: 2,
            createDate: "2026-08-25T15:10:00",
            modifyDate: "2026-08-25T15:10:00",
            email: "kim@example.com",
            shippingAddress: "서울시 송파구 올림픽로 00",
            zipCode: "05551",
            totalPrice: 7000,
            shippingDate: "2026-08-26",
            orderItemList: [
              {
                productId: 3,
                productName: "Ethiopia Yirgacheffe",
                photoUrl: "/images/ethiopia-yirgacheffe.jpg",
                orderPrice: 7000,
                quantity: 1,
                totalPrice: 7000,
              },
            ],
          },
          {
            id: 3,
            createDate: "2026-08-20T11:20:00",
            modifyDate: "2026-08-20T11:20:00",
            email: "suji@example.com",
            shippingAddress: "서울시 강남구 테헤란로 00",
            zipCode: "06236",
            totalPrice: 13000,
            shippingDate: "2026-08-20",
            orderItemList: [
              {
                productId: 2,
                productName: "Brazil Serra Do Caparaó",
                photoUrl: "/images/brazil-serra.jpg",
                orderPrice: 6500,
                quantity: 2,
                totalPrice: 13000,
              },
            ],
          },
        ],
        statusCode: 200,
      };

    return <OrderTable 
            orders={mockOrders.data}
            editPath={(orderId) => `/orders/${orderId}/edit`}
            removeLabel="취소"
            onRemove={()=>{}}
            showActions={(order) => order.shippingDate >= "2026-08-23" }
            />
}