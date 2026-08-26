package com.programmers.be14.nbe12141team03.domain.order.controller;

import com.programmers.be14.nbe12141team03.domain.order.dto.OrderCreateRequest;
import com.programmers.be14.nbe12141team03.domain.order.dto.OrderCreateResponse;
import com.programmers.be14.nbe12141team03.domain.order.dto.OrderResultResponse;
import com.programmers.be14.nbe12141team03.domain.order.dto.mergedShipment.MergedShipmentResponse;
import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import com.programmers.be14.nbe12141team03.domain.order.service.OrderResultService;
import com.programmers.be14.nbe12141team03.global.dto.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderResultController {

    private final OrderResultService orderResultService;

    // [관리자] 다건 조회
    @Operation(summary = "전체 주문 내역 다건 조회")
    @Tag(name = "관리자")
    @GetMapping("/admin")
    public RsData<List<OrderResultResponse>> adminOrderResultList() {
        return new RsData<>(
                "200-1",
                "모든 고객의 전체 주문 내역을 조회했습니다.",
                this.orderResultService.getAllList()
        );
    }

    // [관리자] 배송일 기준 합배송 내역 조회
    @Operation(summary = "합배송 다건 조회")
    @Tag(name = "관리자")
    @GetMapping("/admin/shipments")
    public RsData<List<MergedShipmentResponse>> adminShipmentList(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate shippingDate) {

        return new RsData<>(
                "200-1",
                "해당 배송일의 합배송 내역을 조회했습니다.",
                this.orderResultService.getMergedByShippingDate(shippingDate));
    }

    // [고객] 다건 조회
    @Operation(summary = "자신의 주문 내역 다건 조회")
    @Tag(name = "공용")
    @GetMapping("/my")
    public RsData<List<OrderResultResponse>> getMyOrders(
            @RequestParam
            @NotBlank(message = "Email을 입력해 주세요.")
            @Email(message = "올바른 Email의 형식이 아닙니다.")
            String email
    ){
        List<OrderResultResponse> orders = this.orderResultService.findMyOrders(email);

        String message = orders.isEmpty()
                ? "주문 내역이 없습니다."
                : "현재 고객의 전체 주문 내역을 조회했습니다.";

        return new RsData<>(
                "200-1",
                message,
                orders
        );
    }

    // [고객] 단건 조회
    @Operation(summary = "주문 내역 단건 조회")
    @Tag(name = "공용")
    @GetMapping("/my/{id}")
    public RsData<OrderResultResponse> getMyOrderById(
            @PathVariable Long id
    ){
        return new RsData<>(
                "200-1",
                "현재 고객의 주문 내역 중 선택한 ID의 내역을 조회했습니다.",
                this.orderResultService.findMyOrderById(id)
        );
    }

    // 주문 생성
    @Operation(summary = "주문 생성")
    @Tag(name = "공용")
    @PostMapping
    public OrderCreateResponse createOrder(@Valid @RequestBody OrderCreateRequest request) {
        OrderResult orderResult = orderResultService.createOrder(request);

        return new OrderCreateResponse(orderResult);
    }

    // 주문 삭제
    @Operation(summary = "주문 삭제")
    @Tag(name = "공용")
    @DeleteMapping("/{id}")
    public RsData<Void> deleteOrder(
            @PathVariable Long id
    ){
        orderResultService.deleteOrder(id);

        return new RsData<Void>(
                "200-1",
                "%d번 주문이 삭제되었습니다.".formatted(id)
                );
    }


}
