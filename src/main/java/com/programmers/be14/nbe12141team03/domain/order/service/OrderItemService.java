package com.programmers.be14.nbe12141team03.domain.order.service;

import com.programmers.be14.nbe12141team03.domain.order.entity.OrderItem;
import com.programmers.be14.nbe12141team03.domain.order.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    // [관리자] 모든 고객의 모든 거래 내역 조회
    public List<OrderItem> getAllList() {
        List<OrderItem> allList = this.orderItemRepository.findAll();
        return allList;
    }
}
