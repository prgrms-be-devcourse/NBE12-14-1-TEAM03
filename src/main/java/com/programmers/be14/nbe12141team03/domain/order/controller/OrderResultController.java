package com.programmers.be14.nbe12141team03.domain.order.controller;

import com.programmers.be14.nbe12141team03.domain.order.entity.OrderItem;
import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import com.programmers.be14.nbe12141team03.domain.order.service.OrderResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderResultController {

    private final OrderResultService orderItemService;

    // [관리자] 다건 조회
    @GetMapping("/admin")
    public List<OrderResult> adminOrderItemList() {
        List<OrderResult> allOfOrderItemList = this.orderItemService.getAllList();
        return allOfOrderItemList;
    }

    // [고객] 다건 조회
    @GetMapping("/my")
    public List<OrderResult> getMyOrders(
            @RequestParam String email
    ){
        return orderItemService.findMyOrders(email);
    }

}
