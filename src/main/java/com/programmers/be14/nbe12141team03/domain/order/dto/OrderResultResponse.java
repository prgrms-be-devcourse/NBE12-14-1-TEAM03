package com.programmers.be14.nbe12141team03.domain.order.dto;

import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResultResponse(
        Long id,
        LocalDateTime createDate,
        LocalDateTime modifyDate,
        String email,
        String shippingAddress,
        String zipCode,
        long totalPrice,
        LocalDate shippingDate,
        List<OrderItemResponse> orderItemList,
        boolean modifiable
) {
    public OrderResultResponse(OrderResult orderResult){
        this(
                orderResult.getId(),
                orderResult.getCreateDate(),
                orderResult.getModifyDate(),
                orderResult.getEmail(),
                orderResult.getShippingAddress(),
                orderResult.getZipCode(),
                orderResult.getTotalPrice(),
                orderResult.getShippingDate(),
                orderResult.getOrderItemList().stream()
                        .map(OrderItemResponse::new)
                        .toList(),
                orderResult.isModifiable(LocalDateTime.now())
        );
    }
}
