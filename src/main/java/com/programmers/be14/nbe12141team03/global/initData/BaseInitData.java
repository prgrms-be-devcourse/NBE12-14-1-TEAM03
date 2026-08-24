package com.programmers.be14.nbe12141team03.global.initData;


import com.programmers.be14.nbe12141team03.domain.order.entity.OrderItem;
import com.programmers.be14.nbe12141team03.domain.order.repository.OrderItemRepository;
import com.programmers.be14.nbe12141team03.domain.product.entity.Product;
import com.programmers.be14.nbe12141team03.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class BaseInitData {

    @Autowired
    @Lazy
    private BaseInitData self;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;


    @Bean
    ApplicationRunner initDataRunner() {
        return args -> {
            self.work1();
            self.work2();
        };
    }

    @Transactional
    public void work1() {
        if (productRepository.count() > 0) return;

        productRepository.saveAll(List.of(
                new Product("Columbia Nariñó", "커피콩", 5000, "/images/columbia-narino.png"),
                new Product("Brazil Serra Do Caparaó", "커피콩", 6000, "/images/brazil-serra.png"),
                new Product("Columbia Quindío", "커피콩", 8000, "/images/columbia-quindio.png"),
                new Product("Ethiopia Sidamo", "커피콩", 5500, "/images/ethiopia-sidamo.png")
        ));
    }

    @Transactional
    public void work2() {
        if (orderItemRepository.count() > 0) return;

        List<Product> c = productRepository.findAll();

        OrderItem o1 = new OrderItem("hoonhee@test.com", List.of(c.get(0), c.get(1)),
                "서울시 강남구 테헤란로 1", "06234", 11000);

        OrderItem o2 = new OrderItem("hoonhee@test.com", List.of(c.get(2)),
                "서울시 강남구 테헤란로 1", "06234", 8000);

        OrderItem o3 = new OrderItem("sujee@test.com", List.of(c.get(3)),
                "부산시 해운대구 우동 2", "48095", 5500);

        orderItemRepository.saveAll(List.of(o1, o2, o3));
    }

}