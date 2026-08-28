package com.programmers.be14.nbe12141team03.domain.order.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
public class OrderResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime createDate;

    @LastModifiedDate
    private LocalDateTime modifyDate;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String shippingAddress;

    @Column(nullable = false)
    private String zipCode;

    private int totalPrice;

    @Column(nullable = false)
    private LocalDate shippingDate; // 배송일

    // 주문 상품들과의 1:N 매핑.
    @OneToMany(mappedBy = "orderResult", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<OrderItem> orderItemList = new ArrayList<>();

    public OrderResult(LocalDateTime createDate, String email, String shippingAddress, String zipCode) {
        this.createDate = createDate;
        this.email = email;
        this.shippingAddress = shippingAddress;
        this.zipCode = zipCode;
        this.shippingDate = calculateShipping(this.createDate);
    }

    // 연관관계 편의 메서드
    public void addOrderItem(OrderItem orderItem) {
        orderItemList.add(orderItem);
        orderItem.setOrderResult(this);
        this.totalPrice += orderItem.getTotalPrice();
    }

    // 배송일 계산
    private LocalDate calculateShipping(LocalDateTime createDate){
        // 주문한 시간
        LocalTime currentTime = createDate.toLocalTime();
        // 기준 시간
        LocalTime baseTime = LocalTime.of(14, 0);

        // 14:00 미만의 주문은 당일 배송
        if (currentTime.isBefore(baseTime)) {
            return createDate.toLocalDate();
        }
        // 넘어가면 다음 날 배송
        return createDate.toLocalDate().plusDays(1);
    }

    // 주문 내역 수정 가능 여부 배송일에서 14:00를 넘었으면 주문 수정 불가
    public boolean isModifiable(LocalDateTime now) {
        return now.isBefore(this.shippingDate.atTime(14, 0));
    }

    // 주문 내역 수정
    public void modify(String shippingAddress, String zipCode, List<OrderItem> newItemList) {
        this.shippingAddress = shippingAddress;
        this.zipCode = zipCode;

        // 기존 주문 상품을 고아로 만들어서 DB에서 삭제
        this.orderItemList.clear();
        this.totalPrice = 0;

        // 주문 상품 재등록
        newItemList.forEach(this::addOrderItem);
    }

}
