package com.programmers.be14.nbe12141team03.domain.product.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProductCreateRequest {
    private String name;
    private String category;
    private int price;
    private String photoUrl;
}
