package com.programmers.be14.nbe12141team03.domain.order.service;

import com.programmers.be14.nbe12141team03.domain.order.dto.OrderResultResponse;
import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import com.programmers.be14.nbe12141team03.domain.order.repository.OrderResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderResultService {

    private final OrderResultRepository orderResultRepository;

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
}
