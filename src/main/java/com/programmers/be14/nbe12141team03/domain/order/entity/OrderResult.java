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

    @CreatedDate
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

    private LocalDate shippingDate; // 배송일

    // 주문 상품들과의 1:N 매핑.
    @OneToMany(mappedBy = "orderResult", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<OrderItem> orderItemList = new ArrayList<>();

    public OrderResult(String email, String shippingAddress,
                       String zipCode) {
        this.email = email;
        this.shippingAddress = shippingAddress;
        this.zipCode = zipCode;
    }
    
    // 연관관계 편의 메서드
    public void addOrderItem(OrderItem orderItem) {
        orderItemList.add(orderItem);
        orderItem.setOrderResult(this);
        this.totalPrice += orderItem.getTotalPrice();
    }

    // @EntityListeners(AuditingEntityListener.class)를 사용하면 레포지토리에서 save를 할 때 생성일자등의 생성이 동작한다고 합니다.
    // @PrePersist를 사용하면 생성일자가 결정된 이후 계산이 가능해서 14:00가 넘은 주문을 당일 배송으로 계산하는 버그를 방지했습니다.
    @PrePersist
    public void initShippingDate() {
        if (shippingDate == null) {
            this.shippingDate = calculateShipping(this.createDate);
        }
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
}
