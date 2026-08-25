package com.programmers.be14.nbe12141team03.domain.product.controller;

import com.programmers.be14.nbe12141team03.domain.product.dto.ProductCreateRequest;
import com.programmers.be14.nbe12141team03.domain.product.dto.ProductResponse;
import com.programmers.be14.nbe12141team03.domain.product.entity.Product;
import com.programmers.be14.nbe12141team03.domain.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;


    @GetMapping
    public List<ProductResponse> getProducts() {
        return productService.getProducts();
    }

    @PostMapping
    public Product create(@Valid @RequestBody ProductCreateRequest request){
        return productService.create(request.getName(), request.getCategory(), request.getPrice(), request.getPhotoUrl());
    }

}
