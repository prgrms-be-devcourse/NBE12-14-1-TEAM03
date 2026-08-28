package com.programmers.be14.nbe12141team03.domain.order.dto.mergedShipment;

public record MergedItemResponse(
        Long productId,
        String productName,
        String photoUrl,
        int quantity,
        long totalPrice
) {
}
