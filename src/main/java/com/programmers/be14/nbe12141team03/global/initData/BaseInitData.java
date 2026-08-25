package com.programmers.be14.nbe12141team03.global.initData;


import com.programmers.be14.nbe12141team03.domain.order.entity.OrderItem;
import com.programmers.be14.nbe12141team03.domain.order.entity.OrderResult;
import com.programmers.be14.nbe12141team03.domain.order.repository.OrderResultRepository;
import com.programmers.be14.nbe12141team03.domain.product.entity.Product;
import com.programmers.be14.nbe12141team03.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class BaseInitData {

    @Autowired
    @Lazy
    private BaseInitData self;
    private final OrderResultRepository orderResultRepository;
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
        if (orderResultRepository.count() > 0) return;
        List<Product> products = productRepository.findAll();

        OrderResult o1 = new OrderResult(
                "hoonhee@test.com",
                "서울시 강남구 테헤란로 1", "06234");
        o1.addOrderItem(new OrderItem(
                products.get(0), products.get(0).getPrice(), 1));
        o1.addOrderItem(new OrderItem(
                products.get(0), products.get(0).getPrice(), 3));

        OrderResult o2 = new OrderResult(
                "hoonhee@test.com",
                "서울시 강남구 테헤란로 1", "06234");
        o2.addOrderItem(new OrderItem(
                products.get(2), products.get(2).getPrice(), 1));

        OrderResult o3 = new OrderResult("sujee@test.com",
                "부산시 해운대구 우동 2", "48095");
        o3.addOrderItem(new OrderItem(
                products.get(3), products.get(3).getPrice(), 1));

        orderResultRepository.saveAll(List.of(o1, o2, o3));
    }

}