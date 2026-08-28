package com.programmers.be14.nbe12141team03.domain.order.service;

import com.programmers.be14.nbe12141team03.domain.order.dto.OrderItemRequest;
import com.programmers.be14.nbe12141team03.domain.order.dto.OrderResultResponse;
import com.programmers.be14.nbe12141team03.domain.order.dto.create.OrderCreateRequest;
import com.programmers.be14.nbe12141team03.domain.order.dto.mergedShipment.MergedItemResponse;
import com.programmers.be14.nbe12141team03.domain.order.dto.mergedShipment.MergedShipmentResponse;
import com.programmers.be14.nbe12141team03.domain.order.dto.modify.OrderModifyRequest;
import com.programmers.be14.nbe12141team03.domain.order.entity.OrderItem;
import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import com.programmers.be14.nbe12141team03.domain.order.repository.OrderResultRepository;
import com.programmers.be14.nbe12141team03.domain.product.entity.Product;
import com.programmers.be14.nbe12141team03.domain.product.repository.ProductRepository;
import com.programmers.be14.nbe12141team03.global.exception.ApiServiceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderResultService {

    private final OrderResultRepository orderResultRepository;

    private final ProductRepository productRepository;

    // [관리자] 모든 고객의 모든 거래 내역 조회
    @Transactional(readOnly = true)
    public List<OrderResultResponse> getAllList() {

        return this.orderResultRepository.findAll().reversed().stream()
                .map(OrderResultResponse::new)
                .toList();
    }

    // [관리자] 요청한 배송일에 해당하는 거래 내역 조회
    @Transactional(readOnly = true)
    public List<MergedShipmentResponse> getMergedByShippingDate(LocalDate shippingDate) {
        List<OrderResult> orders = this.orderResultRepository.findByShippingDate(shippingDate);

        // 예외처리 적용
        if (orders.isEmpty()) {
            throw new ApiServiceException(
                    "404-1",
                    "해당 배송일에 주문 내역이 없습니다."
            );
        }

        // 배송일에 해당하는 주문 내역을 이메일, 배송주소, 우편번호를 기준으로 딕셔너리 생성
        Map<String, List<OrderResult>> groupByEmail = orders.stream()
                .collect(Collectors.groupingBy(key ->
                                key.getEmail() + "|" + key.getShippingAddress() + "|" + key.getZipCode(),
                        LinkedHashMap::new,
                        Collectors.toList()));

        return groupByEmail.values().stream()
                .map(group -> toMerged(group, shippingDate))
                .toList();
    }

    private MergedShipmentResponse toMerged(List<OrderResult> group, LocalDate shippingDate) {
        OrderResult first = group.get(0);

        // 합배송 처리될 주문 내역들의 id 리스트
        List<Long> mergedIds = group.stream()
                .map(OrderResult::getId)
                .toList();

        // 하나의 합배송의 총 금액
        int totalPrice = group.stream()
                .mapToInt(OrderResult::getTotalPrice)
                .sum();

        Map<Long, MergedItemResponse> itemMap = new LinkedHashMap<>();

        for (OrderResult order : group) {
            for (OrderItem item : order.getOrderItemList()) {
                Long productId = item.getProduct().getId();

                itemMap.merge(productId,
                        new MergedItemResponse(
                                productId,
                                item.getProduct().getName(),
                                item.getProduct().getPhotoUrl(),
                                item.getQuantity(),
                                item.getTotalPrice()
                        ),
                        (existing, incoming) -> new MergedItemResponse(
                                existing.productId(),
                                existing.productName(),
                                existing.photoUrl(),
                                existing.quantity() + incoming.quantity(),
                                existing.totalPrice() + incoming.totalPrice()
                        ));
            }
        }

        return new MergedShipmentResponse(
                first.getEmail(),
                first.getShippingDate(),
                first.getShippingAddress(),
                first.getZipCode(),
                group.size(),
                mergedIds,
                totalPrice,
                List.copyOf(itemMap.values())
        );


    }

    // [고객] 내 주문내역 조회
    @Transactional(readOnly = true)
    public List<OrderResultResponse> findMyOrders(String email) {

        return this.orderResultRepository.findByEmail(email).reversed().stream()
                .map(OrderResultResponse::new)
                .toList();
    }

    // [고객] 선택한 주문내역의 ID를 통해 단건 조회
    @Transactional(readOnly = true)
    public OrderResultResponse findMyOrderById(Long id) {
        return new OrderResultResponse(
                this.orderResultRepository.findById(id).orElseThrow(() ->
                        new ApiServiceException("404-1",
                                "해당 ID의 주문 내역은 존재하지 않습니다.")));
    }

    //고객 주문 생성
    @Transactional
    public OrderResult createOrder(OrderCreateRequest request) {
        LocalDateTime orderedAt = LocalDateTime.now();

        // 주문 상품이 없는 경우 주문 생성 방지
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new ApiServiceException(
                    "400-2",
                    "주문 상품을 하나 이상 선택해야 합니다."
            );
        }

        // 고객 정보와 배송 정보로 주문 생성
        OrderResult orderResult = new OrderResult(
                orderedAt,
                request.getEmail(),
                request.getShippingAddress(),
                request.getZipCode()
        );

        //요청받은 상품 id로 주문 상품 구성
        for (OrderItemRequest item : request.getItems()) {

            // 상품 수량은 1개 이상만 허용
            if (item.quantity() <= 0) {
                throw new ApiServiceException(
                        "400-1",
                        "상품 수량은 1개 이상이어야 합니다."
                );
            }

            // 상품 ID로 상품을 조회하고, 존재하지 않으면 404 예외 발생
            Product product = productRepository.findById(item.productId())
                    .orElseThrow(() ->
                            new ApiServiceException(
                                    "404-1",
                                    "해당 상품을 찾을 수 없습니다."
                            )
                    );

            OrderItem orderItem = new OrderItem(
                    product,
                    product.getPrice(),
                    item.quantity()
            );

            orderResult.addOrderItem(orderItem);
        }

        return orderResultRepository.save(orderResult);
    }

    //주문 삭제
    @Transactional
    public void deleteOrder(Long id) {
        OrderResult orderResult = orderResultRepository.findById(id)
                .orElseThrow(() ->
                        new ApiServiceException(
                                "404-1",
                                "존재하지 않는 주문입니다."
                        ));

        // 이미 배송일이 지난 상품 예외 처리
        if (!orderResult.isModifiable(LocalDateTime.now())) {
            throw new ApiServiceException(
                    "400-1",
                    "이미 배송 준비가 시작되어 취소할 수 없습니다."
            );
        }

        orderResultRepository.delete(orderResult);
    }

    // 주문 수정
    @Transactional
    public OrderResultResponse modifyOrderResult(Long id, OrderModifyRequest request) {

        // 주문 내역 존재 여부 예외 처리
        OrderResult origin = this.orderResultRepository.findById(id)
                .orElseThrow(() -> new ApiServiceException(
                        "404-1",
                        "존재하지 않는 주문입니다"
                ));

        // 이미 배송일이 지난 상품 예외 처리
        if (!origin.isModifiable(LocalDateTime.now())) {
            throw new ApiServiceException(
                    "400-1",
                    "이미 배송 준비가 시작되어 수정할 수 없습니다."
            );
        }

        // 상품 존재 여부 예외 처리 및 새로운 리스트 생성
        List<OrderItem> modifiedItemList = request.orderItemList().stream()
                .map(req -> {
                    Product product = this.productRepository.findById(req.productId())
                            .orElseThrow(() -> new ApiServiceException(
                                    "404-2",
                                    "%d번 상품을 찾을 수 없습니다.".formatted(req.productId())));
                    return new OrderItem(product, product.getPrice(), req.quantity());
                })
                .toList();

        origin.modify(
                request.shippingAddress(),
                request.zipCode(),
                modifiedItemList
        );

        // 이 시점에 실제 DB 업데이트를 통해 응답의 수정 시각이 정확하게 반영되도록 함
        this.orderResultRepository.flush();

        return new OrderResultResponse(origin);
    }
}
