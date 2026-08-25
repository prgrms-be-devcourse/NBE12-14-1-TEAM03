package com.programmers.be14.nbe12141team03.domain.order.dto;

import jakarta.validation.constraints.Positive;

// 주문 상품별 상품 ID와 수량
public record OrderItemRequest(
        @Positive(message = "주문 상품 ID는 음수 및 0일 수 없습니다.")
        Long productId,

        @Positive(message = "주문 상품 수량은 1 이상이어야 합니다.")
        int quantity
) {

}
