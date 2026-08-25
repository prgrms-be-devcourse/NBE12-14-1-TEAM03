package com.programmers.be14.nbe12141team03.domain.order.controller;

import com.programmers.be14.nbe12141team03.domain.order.dto.OrderCreateRequest;
import com.programmers.be14.nbe12141team03.domain.order.dto.OrderCreateResponse;
import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import com.programmers.be14.nbe12141team03.domain.order.service.OrderResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderResultController {

    private final OrderResultService orderItemService;

    // [관리자] 다건 조회
    @GetMapping("/admin/orders")
    public List<OrderResult> adminOrderItemList() {
        List<OrderResult> allOfOrderItemList = this.orderItemService.getAllList();
        return allOfOrderItemList;
    }

    //주문 생성
    @PostMapping("/orders/create")
    public OrderCreateResponse createOrder(@RequestBody OrderCreateRequest request) {
        OrderResult orderResult = orderItemService.createOrder(request);

        return new OrderCreateResponse(orderResult);
    }

}
