package com.programmers.be14.nbe12141team03.domain.order.service;

import com.programmers.be14.nbe12141team03.domain.order.entity.OrderItem;
import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import com.programmers.be14.nbe12141team03.domain.order.repository.OrderResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderResultService {

    private final OrderResultRepository orderResultRepository;

    // [관리자] 모든 고객의 모든 거래 내역 조회
    public List<OrderResult> getAllList() {
        List<OrderResult> allList = this.orderResultRepository.findAll();
        return allList;
    }

    // [고객] 내 주문내역 조회
    public List<OrderResult> findMyOrders(String email){
        return orderResultRepository.findByEmail(email);
    }
}
