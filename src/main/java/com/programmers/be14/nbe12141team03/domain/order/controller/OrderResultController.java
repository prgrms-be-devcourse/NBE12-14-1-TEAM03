package com.programmers.be14.nbe12141team03.domain.order.controller;

import com.programmers.be14.nbe12141team03.domain.order.dto.OrderResultResponse;
import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import com.programmers.be14.nbe12141team03.domain.order.service.OrderResultService;
import com.programmers.be14.nbe12141team03.global.dto.RsData;
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
    public RsData<List<OrderResultResponse>> adminOrderItemList() {
        return new RsData<>(
                "200-1",
                "모든 고객의 전체 주문 내역을 조회했습니다.",
                this.orderItemService.getAllList()
        );
    }

    // [고객] 다건 조회
    @GetMapping("/my")
    public RsData<List<OrderResultResponse>> getMyOrders(
            @RequestParam String email
    ){
        return new RsData<>(
                "200-1",
                "현재 고객의 전체 주문 내역을 조회했습니다.",
                this.orderItemService.findMyOrders(email)
        );
    }

}
