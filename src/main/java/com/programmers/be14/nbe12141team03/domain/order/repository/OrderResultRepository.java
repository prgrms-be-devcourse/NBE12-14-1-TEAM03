package com.programmers.be14.nbe12141team03.domain.order.repository;

import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface OrderResultRepository extends JpaRepository<OrderResult, Long> {
    @Query("""
                select distinct o
                from OrderResult o
                join fetch o.orderItemList oi
                join fetch oi.product
                where o.id = :id
            """)
    public Optional<OrderResult> findByIdWithItemsAndProducts(Long id);

    @Query("""
                select distinct o
                from OrderResult o
                join fetch o.orderItemList oi
                join fetch oi.product
                order by o.createDate desc
            """)
    public List<OrderResult> findAllWithItemsAndProducts();

    @Query("""
                select distinct o
                from OrderResult o
                join fetch o.orderItemList oi
                join fetch oi.product
                where o.email = :email
                order by o.createDate desc
            """)
    public List<OrderResult> findByEmailWithItemsAndProducts(String email);

    @Query("""
                select distinct o
                from OrderResult o
                join fetch o.orderItemList oi
                join fetch oi.product
                where o.shippingDate = :shippingDate
            """)
    public List<OrderResult> findByShippingDateWithItemsAndProducts(LocalDate shippingDate);
}
