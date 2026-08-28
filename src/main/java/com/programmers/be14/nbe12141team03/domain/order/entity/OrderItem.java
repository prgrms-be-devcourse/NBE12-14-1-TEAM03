package com.programmers.be14.nbe12141team03.domain.order.entity;

import com.programmers.be14.nbe12141team03.domain.product.entity.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Entity
@NoArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 주문 결과와의 N:1 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ORDER_RESULT_ID", nullable = false)
    @Setter
    private OrderResult orderResult;

    // 상품과의 N:1 매핑
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;

    @Column(nullable = false)
    private long orderPrice; // 주문 당시 가격 (상품 가격 변동에 영향받지 않도록 저장)

    @Column(nullable = false)
    private int quantity; // ⭐️주문 수량

    public OrderItem(Product product, long orderPrice, int quantity) {
        this.product = product;
        this.orderPrice = orderPrice;
        this.quantity = quantity;
    }

    // 주문 상품 총 가격 계산
    public long getTotalPrice() {
        // 계산 결과가 long 범위를 초과하면 예외 발생
        return Math.multiplyExact(orderPrice, (long) quantity);
    }
}
