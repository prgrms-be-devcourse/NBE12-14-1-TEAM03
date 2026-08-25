package com.programmers.be14.nbe12141team03.domain.order.entity;

import com.programmers.be14.nbe12141team03.domain.product.entity.Product;
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
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    private LocalDateTime createDate;

    @LastModifiedDate
    private LocalDateTime modifyDate;

    @Column(nullable = false)
    private String email;

    @ManyToMany()   // cascade = CascadeType.ALL 적용 시 주문 취소 -> 상품 삭제라서 우선 제거했습니다.
    @JoinTable(
            name = "order_product",
            joinColumns = @JoinColumn(name = "order_item_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> productList = new ArrayList<>();

    @Column(nullable = false)
    private String shippingAddress;

    @Column(nullable = false)
    private String zipCode;

    private int totalPrice;

    private LocalDate shippingDate; // 배송일

    public OrderItem(String email, List<Product> productList, String shippingAddress,
                     String zipCode, int totalPrice) {
        this.email = email;
        this.productList = productList;
        this.shippingAddress = shippingAddress;
        this.zipCode = zipCode;
        this.totalPrice = totalPrice;
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
