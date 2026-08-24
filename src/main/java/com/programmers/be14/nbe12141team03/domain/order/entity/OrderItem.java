package com.programmers.be14.nbe12141team03.domain.order.entity;

import com.programmers.be14.nbe12141team03.domain.product.entity.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
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

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "ORDER_ITEM_ID")
    private List<Product> productList = new ArrayList<>();

    @Column(nullable = false)
    private String shippingAddress;

    @Column(nullable = false)
    private String zipCode;

    private int totalPrice;

    public OrderItem(String email, List<Product> productList, String shippingAddress,
                     String zipCode, int totalPrice) {
        this.email = email;
        this.productList = productList;
        this.shippingAddress = shippingAddress;
        this.zipCode = zipCode;
        this.totalPrice = totalPrice;
    }
}
