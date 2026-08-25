package com.programmers.be14.nbe12141team03.domain.order.dto;

import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import lombok.Getter;

import java.time.LocalDate;

@Getter
//주문 생성 응답 dto
public class OrderCreateResponse {
    private Long orderId;

    private String email;

    private int totalPrice;

    private LocalDate shippingDate;

    public OrderCreateResponse(OrderResult orderResult) {
        this.orderId = orderResult.getId();

        this.email = orderResult.getEmail();

        this.totalPrice = orderResult.getTotalPrice();

        this.shippingDate = orderResult.getShippingDate();
    }
}
