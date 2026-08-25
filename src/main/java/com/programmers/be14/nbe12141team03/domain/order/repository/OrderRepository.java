package com.programmers.be14.nbe12141team03.domain.order.repository;

import com.programmers.be14.nbe12141team03.domain.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<OrderItem, Long> {
    public List<OrderItem> findByEmail(String email);
}
