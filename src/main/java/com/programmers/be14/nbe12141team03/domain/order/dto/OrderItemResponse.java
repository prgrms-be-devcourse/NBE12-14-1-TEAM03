package com.programmers.be14.nbe12141team03.domain.order.dto;

import com.programmers.be14.nbe12141team03.domain.order.entity.OrderItem;

public record OrderItemResponse(
        Long productId,
        String productName,
        String photoUrl,
        int orderPrice,
        int quantity,
        int totalPrice
) {
    public OrderItemResponse(OrderItem orderItem) {
        this(
                orderItem.getProduct().getId(),
                orderItem.getProduct().getName(),
                orderItem.getProduct().getPhotoUrl(),
                orderItem.getOrderPrice(),
                orderItem.getQuantity(),
                orderItem.getTotalPrice()
        );
    }
}
