package com.programmers.be14.nbe12141team03.domain.order.controller;

import com.programmers.be14.nbe12141team03.domain.order.dto.OrderCreateRequest;
import com.programmers.be14.nbe12141team03.domain.order.dto.OrderCreateResponse;
import com.programmers.be14.nbe12141team03.domain.order.dto.OrderResultResponse;
import com.programmers.be14.nbe12141team03.domain.order.dto.mergedShipment.MergedShipmentResponse;
import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import com.programmers.be14.nbe12141team03.domain.order.service.OrderResultService;
import com.programmers.be14.nbe12141team03.global.dto.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderResultController {

    private final OrderResultService orderResultService;

    // [관리자] 다건 조회
    @GetMapping("/admin")
    public RsData<List<OrderResultResponse>> adminOrderResultList() {
        return new RsData<>(
                "200-1",
                "모든 고객의 전체 주문 내역을 조회했습니다.",
                this.orderResultService.getAllList()
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
                this.orderResultService.findMyOrders(email)
        );
    }

    // [고객] 단건 조회
    @GetMapping("/my/{id}")
    public RsData<OrderResultResponse> getMyOrderById(
            @RequestParam Long id
    ){
        return new RsData<>(
                "200-1",
                "현재 고객의 주문 내역 중 선택한 ID의 내역을 조회했습니다.",
                this.orderResultService.findMyOrderById(id)
        );
    }

    //주문 생성
    @PostMapping("/create")
    public OrderCreateResponse createOrder(@RequestBody OrderCreateRequest request) {
        OrderResult orderResult = orderItemService.createOrder(request);

        return new OrderCreateResponse(orderResult);
    }

    // [관리자] 배송일 기준 합배송 내역 조회
    @GetMapping("/admin/shipments")
    public RsData<List<MergedShipmentResponse>> adminShipmentList(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate shippingDate) {

        return new RsData<>(
                "200-1",
                "해당 배송일의 합배송 내역을 조회했습니다.",
                this.orderResultService.getMergedByShippingDate(shippingDate));
    }
}
