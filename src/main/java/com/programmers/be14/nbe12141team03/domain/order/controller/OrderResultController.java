package com.programmers.be14.nbe12141team03.domain.order.controller;

import com.programmers.be14.nbe12141team03.domain.order.dto.OrderCreateRequest;
import com.programmers.be14.nbe12141team03.domain.order.dto.OrderCreateResponse;
import com.programmers.be14.nbe12141team03.domain.order.dto.OrderResultResponse;
import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import com.programmers.be14.nbe12141team03.domain.order.service.OrderResultService;
import com.programmers.be14.nbe12141team03.global.dto.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    // [고객] 단건 조회
    @GetMapping("/my/{id}")
    public RsData<OrderResultResponse> getMyOrderById(
            @PathVariable Long id
    ){
        return new RsData<>(
                "200-1",
                "현재 고객의 주문 내역 중 선택한 ID의 내역을 조회했습니다.",
                this.orderItemService.findMyOrderById(id)
        );
    }

    //주문 생성
    @PostMapping("/create")
    public OrderCreateResponse createOrder(@Valid @RequestBody OrderCreateRequest request) {
        OrderResult orderResult = orderItemService.createOrder(request);

        return new OrderCreateResponse(orderResult);
    }

}
