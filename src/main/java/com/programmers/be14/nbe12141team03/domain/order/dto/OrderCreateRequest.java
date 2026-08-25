package com.programmers.be14.nbe12141team03.domain.order.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;

import java.util.List;

@Getter
public class OrderCreateRequest {

    @Email(message = "올바른 Email의 형식이 아닙니다.")
    @NotBlank(message = "Email를 입력해주세요.")
    private String email;

    @NotEmpty(message = "구매 상품을 하나 이상 선택해주세요.")
    private List<OrderItemRequest> items;

    @NotBlank(message = "배송지를 입력해주세요.")
    private String shippingAddress;

    @NotBlank(message = "우편 번호를 입력해주세요.")
    @Pattern(regexp = "^\\d{5}$", message = "우편 번호는 5자리 숫자여야 합니다.")
    private String zipCode;
}
