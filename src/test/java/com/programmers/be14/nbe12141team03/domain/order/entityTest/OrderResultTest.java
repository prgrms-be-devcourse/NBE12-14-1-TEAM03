package com.programmers.be14.nbe12141team03.domain.order.entityTest;

import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class OrderResultTest {

    @Test
    @DisplayName("14:00 이전 주문은 당일 배송")
    void t1() {
        OrderResult order = new OrderResult(
                LocalDateTime.of(2026, 8, 28, 13, 59, 59),
                "test@test.com", "서울", "06234");

        assertThat(order.getShippingDate()).isEqualTo(LocalDate.of(2026, 8, 28));
    }

    @Test
    @DisplayName("14:00 정각 주문은 다음 날 배송")
    void t2() {
        OrderResult order = new OrderResult(
                LocalDateTime.of(2026, 8, 28, 14, 0, 0),
                "test@test.com", "서울", "06234");

        assertThat(order.getShippingDate()).isEqualTo(LocalDate.of(2026, 8, 29));
    }
}