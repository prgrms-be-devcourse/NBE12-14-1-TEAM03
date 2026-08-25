package com.programmers.be14.nbe12141team03.domain.product.service;

import com.programmers.be14.nbe12141team03.domain.product.dto.ProductResponse;
import com.programmers.be14.nbe12141team03.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<ProductResponse> getProducts() {
        return productRepository.findAll()
                .stream()
                .map(product -> new ProductResponse(product))
                .toList();
    }

}
