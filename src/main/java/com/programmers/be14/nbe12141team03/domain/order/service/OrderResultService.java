package com.programmers.be14.nbe12141team03.domain.order.service;
import com.programmers.be14.nbe12141team03.domain.order.dto.OrderCreateRequest;
import com.programmers.be14.nbe12141team03.domain.order.entity.OrderItem;
import com.programmers.be14.nbe12141team03.domain.order.dto.OrderResultResponse;
import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import com.programmers.be14.nbe12141team03.domain.order.repository.OrderResultRepository;
import com.programmers.be14.nbe12141team03.domain.product.entity.Product;
import com.programmers.be14.nbe12141team03.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderResultService {

    private final OrderResultRepository orderResultRepository;

    private final ProductRepository productRepository;

    // [관리자] 모든 고객의 모든 거래 내역 조회
    @Transactional(readOnly = true)
    public List<OrderResultResponse> getAllList() {

        return this.orderResultRepository.findAll().stream()
                .map(OrderResultResponse::new)
                .toList();
    }

    // [고객] 내 주문내역 조회
    @Transactional(readOnly = true)
    public List<OrderResultResponse> findMyOrders(String email){

        return this.orderResultRepository.findByEmail(email).stream()
                .map(OrderResultResponse::new)
                .toList();
    }

    //고객 주문 생성
    @Transactional
    public OrderResult createOrder(OrderCreateRequest request) {

        //고객 정보와 배송 정보로 주문 생성
        OrderResult orderResult = new OrderResult(
                request.getEmail(),
                request.getShippingAddress(),
                request.getZipCode()
        );

        //요정받은 상품 id로 주문 상품 구성
        for (Long productId : request.getProductIds()) {
            Product product = productRepository.findById(productId)
                    .orElseThrow();

            OrderItem orderItem = new OrderItem(
                    product,
                    product.getPrice(),
                    //주문 수량 적용전까지 1개로 처리
                    1
            );

            orderResult.addOrderItem(orderItem);
        }

        return orderResultRepository.save(orderResult);
    }

}
