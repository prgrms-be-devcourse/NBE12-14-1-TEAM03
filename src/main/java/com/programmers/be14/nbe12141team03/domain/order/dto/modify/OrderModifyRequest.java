package com.programmers.be14.nbe12141team03.domain.order.dto.modify;

import com.programmers.be14.nbe12141team03.domain.order.dto.OrderItemRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;


public record OrderModifyRequest(
        @NotBlank(message = "배송지를 입력해 주세요.")
        String shippingAddress,

        @NotBlank(message = "우편번호를 입력해 주세요.")
        String zipCode,

        @NotEmpty(message = "주문 상품은 최소 1개 이상이어야 합니다.")
        @Valid
        List<OrderItemRequest> orderItemList
) {
    public record OrderItemRequest(
            @NotNull(message = "상품 ID를 입력해 주세요.")
            Long productId,

            @Min(value = 1, message = "수량은 1개 이상이어야 합니다.")
            int quantity
    ) {}
}
