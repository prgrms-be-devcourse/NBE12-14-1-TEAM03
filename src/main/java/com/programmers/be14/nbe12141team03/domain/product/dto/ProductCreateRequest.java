package com.programmers.be14.nbe12141team03.domain.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProductCreateRequest {
    @NotBlank(message = "상품 이름을 입력해주세요.")
    private String name;

    @NotBlank(message = "카테고리를 입력해주세요.")
    private String category;

    @Positive(message = "상품 가격은 음수이거나 0일 수 없습니다.")
    private int price;

    private String photoUrl;
}
