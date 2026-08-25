package com.programmers.be14.nbe12141team03.domain.order.dto;

// 주문 상품별 상품 ID와 수량
public record OrderItemRequest(
        Long productId,
        int quantity
) {

}
