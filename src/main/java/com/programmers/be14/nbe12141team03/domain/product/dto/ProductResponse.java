package com.programmers.be14.nbe12141team03.domain.product.dto;


import com.programmers.be14.nbe12141team03.domain.product.entity.Product;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ProductResponse {
    private Long id;

    private String name;

    private String category;

    private int price;

    private String photoUrl;

    private LocalDateTime createDate;

    private LocalDateTime modifyDate;

    public ProductResponse(Product product) {
        this.id = product.getId();

        this.name = product.getName();

        this.category = product.getCategory();

        this.price = product.getPrice();

        this.photoUrl = product.getPhotoUrl();

        this.createDate = product.getCreateDate();

        this.modifyDate = product.getModifyDate();
    }
}
