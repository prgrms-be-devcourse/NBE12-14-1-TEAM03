package com.programmers.be14.nbe12141team03.domain.product.entity;

import com.programmers.be14.nbe12141team03.domain.dto.ProductCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/product")
public class ProductController {
    private final ProductService productService;

    @PostMapping("/create")
    public Product create(@RequestBody ProductCreateRequest request){
        return productService.create(request.getName(), request.getCategory(), request.getPrice(), request.getPhotoUrl());
    }

    @GetMapping("/list")
    public List<Product> list(){
        return productService.findAll();
    }
}

