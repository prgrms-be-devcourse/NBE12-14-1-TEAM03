package com.programmers.be14.nbe12141team03.domain.order.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class OrderCreateRequest {
    private String email;

    private List<Long> productIds;
}
