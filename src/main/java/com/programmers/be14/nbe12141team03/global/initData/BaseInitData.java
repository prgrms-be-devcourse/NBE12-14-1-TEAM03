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

import java.time.LocalDate;
import java.util.ArrayList;
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

        Product narino = products.get(0);      // 5000원
        Product brazil = products.get(1);      // 6000원
        Product quindio = products.get(2);     // 8000원
        Product ethiopia = products.get(3);    // 5500원

        LocalDate today = LocalDate.now();

        // ===== 지난 배송 (수정/취소 불가 케이스) =====

        // 3일 전 - 합배송 2건
        OrderResult p1 = new OrderResult("hoonhee@test.com", "서울시 강남구 테헤란로 1", "06234", today.minusDays(3));
        p1.addOrderItem(new OrderItem(narino, narino.getPrice(), 1));

        OrderResult p2 = new OrderResult("hoonhee@test.com", "서울시 강남구 테헤란로 1", "06234", today.minusDays(3));
        p2.addOrderItem(new OrderItem(quindio, quindio.getPrice(), 2));

        // 2일 전
        OrderResult p3 = new OrderResult("minji@test.com", "광주시 서구 상무대로 7", "61949", today.minusDays(2));
        p3.addOrderItem(new OrderItem(brazil, brazil.getPrice(), 3));
        p3.addOrderItem(new OrderItem(ethiopia, ethiopia.getPrice(), 1));

        // 어제 - 같은 이메일이지만 배송지가 달라 분리되는 케이스
        OrderResult p4 = new OrderResult("sujee@test.com", "부산시 해운대구 우동 2", "48095", today.minusDays(1));
        p4.addOrderItem(new OrderItem(narino, narino.getPrice(), 2));

        OrderResult p5 = new OrderResult("sujee@test.com", "부산시 수영구 광안로 9", "48300", today.minusDays(1));
        p5.addOrderItem(new OrderItem(ethiopia, ethiopia.getPrice(), 1));

        // ===== 오늘 배송 =====

        // 합배송 3건 - 같은 상품이 여러 주문에 걸쳐 합산되는 케이스
        OrderResult t1 = new OrderResult("hoonhee@test.com", "서울시 강남구 테헤란로 1", "06234", today);
        t1.addOrderItem(new OrderItem(narino, narino.getPrice(), 2));
        t1.addOrderItem(new OrderItem(brazil, brazil.getPrice(), 1));

        OrderResult t2 = new OrderResult("hoonhee@test.com", "서울시 강남구 테헤란로 1", "06234", today);
        t2.addOrderItem(new OrderItem(narino, narino.getPrice(), 3));

        OrderResult t3 = new OrderResult("hoonhee@test.com", "서울시 강남구 테헤란로 1", "06234", today);
        t3.addOrderItem(new OrderItem(quindio, quindio.getPrice(), 1));
        t3.addOrderItem(new OrderItem(ethiopia, ethiopia.getPrice(), 2));

        // 단독 주문
        OrderResult t4 = new OrderResult("sujee@test.com", "부산시 해운대구 우동 2", "48095", today);
        t4.addOrderItem(new OrderItem(ethiopia, ethiopia.getPrice(), 1));

        // 상품 4종 전부
        OrderResult t5 = new OrderResult("jaechul@test.com", "인천시 연수구 송도과학로 4", "21999", today);
        t5.addOrderItem(new OrderItem(narino, narino.getPrice(), 1));
        t5.addOrderItem(new OrderItem(brazil, brazil.getPrice(), 1));
        t5.addOrderItem(new OrderItem(quindio, quindio.getPrice(), 1));
        t5.addOrderItem(new OrderItem(ethiopia, ethiopia.getPrice(), 1));

        // 대량 주문
        OrderResult t6 = new OrderResult("cafe@test.com", "서울시 마포구 홍익로 12", "04039", today);
        t6.addOrderItem(new OrderItem(narino, narino.getPrice(), 20));
        t6.addOrderItem(new OrderItem(brazil, brazil.getPrice(), 15));

        // ===== 내일 배송 =====

        OrderResult n1 = new OrderResult("heewon@test.com", "대전시 유성구 대학로 3", "34126", today.plusDays(1));
        n1.addOrderItem(new OrderItem(brazil, brazil.getPrice(), 2));

        OrderResult n2 = new OrderResult("heewon@test.com", "대전시 유성구 대학로 3", "34126", today.plusDays(1));
        n2.addOrderItem(new OrderItem(quindio, quindio.getPrice(), 1));

        OrderResult n3 = new OrderResult("dukwoo@test.com", "제주시 첨단로 8", "63309", today.plusDays(1));
        n3.addOrderItem(new OrderItem(narino, narino.getPrice(), 5));

        // ===== 모레 이후 =====

        OrderResult f1 = new OrderResult("jaechul@test.com", "인천시 연수구 송도과학로 4", "21999", today.plusDays(2));
        f1.addOrderItem(new OrderItem(quindio, quindio.getPrice(), 1));

        OrderResult f2 = new OrderResult("minji@test.com", "광주시 서구 상무대로 7", "61949", today.plusDays(2));
        f2.addOrderItem(new OrderItem(ethiopia, ethiopia.getPrice(), 4));
        f2.addOrderItem(new OrderItem(narino, narino.getPrice(), 2));

        OrderResult f3 = new OrderResult("cafe@test.com", "서울시 마포구 홍익로 12", "04039", today.plusDays(3));
        f3.addOrderItem(new OrderItem(brazil, brazil.getPrice(), 10));

        // ===== 대량 합배송 (오늘, 12건) =====
        // 한 고객이 하루에 여러 번 주문한 케이스 - 배지 목록 UI 확인용
        List<OrderResult> bulkToday = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            OrderResult b = new OrderResult(
                    "bulk@test.com", "서울시 종로구 세종대로 100", "03172", today);

            Product p = products.get(i % 4);
            b.addOrderItem(new OrderItem(p, p.getPrice(), (i % 3) + 1));

            bulkToday.add(b);
        }

        // ===== 초대량 합배송 (내일, 25건) =====
        List<OrderResult> bulkTomorrow = new ArrayList<>();
        for (int i = 1; i <= 25; i++) {
            OrderResult b = new OrderResult(
                    "heavy@test.com", "경기도 성남시 분당구 판교로 200", "13529", today.plusDays(1));

            b.addOrderItem(new OrderItem(narino, narino.getPrice(), 1));
            if (i % 2 == 0) {
                b.addOrderItem(new OrderItem(brazil, brazil.getPrice(), 2));
            }

            bulkTomorrow.add(b);
        }

        orderResultRepository.saveAll(List.of(
                p1, p2, p3, p4, p5,
                t1, t2, t3, t4, t5, t6,
                n1, n2, n3,
                f1, f2, f3
        ));
        orderResultRepository.saveAll(bulkToday);
        orderResultRepository.saveAll(bulkTomorrow);
    }

}