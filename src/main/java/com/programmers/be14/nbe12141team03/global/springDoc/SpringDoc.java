package com.programmers.be14.nbe12141team03.global.springDoc;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(
        title = "Grids & Circles API",
        description = "카페 원두 주문 서비스 API 문서입니다."
))
public class SpringDoc {

    @Bean
    public GroupedOpenApi orderApi() {
        return GroupedOpenApi.builder()
                .group("주문")
                .pathsToMatch("/api/orders", "/api/orders/**")
                .build();
    }

    @Bean
    public GroupedOpenApi productApi() {
        return GroupedOpenApi.builder()
                .group("상품")
                .pathsToMatch("/api/products", "/api/products/**")
                .build();
    }
}
