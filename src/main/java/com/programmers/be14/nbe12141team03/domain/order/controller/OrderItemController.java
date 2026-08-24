package com.programmers.be14.nbe12141team03.domain.order.controller;

import com.programmers.be14.nbe12141team03.domain.order.entity.OrderItem;
import com.programmers.be14.nbe12141team03.domain.order.service.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderItemController {

    private final OrderItemService orderItemService;

    // [관리자] 다건 조회
    @GetMapping("/admin/orders")
    public List<OrderItem> adminOrderItemList() {
        List<OrderItem> allOfOrderItemList = this.orderItemService.getAllList();
        return allOfOrderItemList;
    }

}
