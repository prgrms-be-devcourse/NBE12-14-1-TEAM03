package com.programmers.be14.nbe12141team03.domain.product.controller;

import com.programmers.be14.nbe12141team03.domain.product.dto.ProductCreateRequest;
import com.programmers.be14.nbe12141team03.domain.product.dto.ProductResponse;
import com.programmers.be14.nbe12141team03.domain.product.entity.Product;
import com.programmers.be14.nbe12141team03.domain.product.service.ProductService;
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
    public List<ProductResponse> getProducts() {
        return productService.getProducts();
    }


    // [관리자] 상품 추가
    @Tag(name = "관리자")
    @Operation(summary = "상품 추가")
    @PostMapping("/admin")
    public Product create(@Valid @RequestBody ProductCreateRequest request){
        return productService.create(request.getName(), request.getCategory(), request.getPrice(), request.getPhotoUrl());
    }

}
