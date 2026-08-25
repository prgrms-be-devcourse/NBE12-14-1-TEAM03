package com.programmers.be14.nbe12141team03.domain.product.entity;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public Product create(String name, String category, int price, String photoUrl){
        Product product = new Product(name, category, price, photoUrl);
        return this.productRepository.save(product);
    }

    public List<Product> findAll(){
        return this.productRepository.findAll();
    }
}
