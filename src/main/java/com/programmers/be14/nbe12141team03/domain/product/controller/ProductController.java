package com.programmers.be14.nbe12141team03.domain.product.controller;

import com.programmers.be14.nbe12141team03.domain.product.dto.ProductCreateRequest;
import com.programmers.be14.nbe12141team03.domain.product.dto.ProductResponse;
import com.programmers.be14.nbe12141team03.domain.product.entity.Product;
import com.programmers.be14.nbe12141team03.domain.product.service.ProductService;
import com.programmers.be14.nbe12141team03.global.dto.RsData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    // 상품 다건 조회
    @Tag(name = "공용")
    @Operation(summary = "상품 다건 조회")
    @GetMapping
    public RsData<List<ProductResponse>> getProducts() {
        return new RsData<>(
                "200-1",
                "상품 목록을 조회했습니다.",
                productService.getProducts()
        );
    }


    // [관리자] 상품 추가
    @Tag(name = "관리자")
    @Operation(summary = "상품 추가")
    @PostMapping("/admin")
    public RsData<ProductResponse> create(@Valid @RequestBody ProductCreateRequest request){
        Product product = productService.create(
                request.getName(),
                request.getCategory(),
                request.getPrice(),
                request.getPhotoUrl()
        );

        return new RsData<>(
                "200-1",
                "%d번 상품이 추가되었습니다.".formatted(product.getId()),
                new ProductResponse(product)
        );
    }

}
