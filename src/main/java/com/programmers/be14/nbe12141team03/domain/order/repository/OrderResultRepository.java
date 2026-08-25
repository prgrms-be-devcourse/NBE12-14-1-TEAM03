package com.programmers.be14.nbe12141team03.domain.order.repository;

import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;


public interface OrderResultRepository extends JpaRepository<OrderResult, Long> {
    public List<OrderResult> findByEmail(String email);
    public List<OrderResult> findByShippingDate(LocalDate shippingDate);
}
