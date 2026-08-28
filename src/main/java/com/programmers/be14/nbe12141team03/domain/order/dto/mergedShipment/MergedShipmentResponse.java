package com.programmers.be14.nbe12141team03.domain.order.dto.mergedShipment;

import java.time.LocalDate;
import java.util.List;

public record MergedShipmentResponse(
        String email,
        LocalDate shippingDate,
        String shippingAddress,
        String zipCode,
        int orderCount,
        List<Long> mergedOrderIds,
        long totalPrice,
        List<MergedItemResponse> orderItemList
) {}
