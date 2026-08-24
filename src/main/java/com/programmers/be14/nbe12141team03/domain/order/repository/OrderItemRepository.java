package com.programmers.be14.nbe12141team03.domain.order.repository;

import com.programmers.be14.nbe12141team03.domain.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;


public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {


}
