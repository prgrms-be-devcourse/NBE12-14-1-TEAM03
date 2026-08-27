package com.programmers.be14.nbe12141team03.global.springDoc;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
            title = "Grids & Circles API",
            description = "카페 원두 주문 서비스 API 문서입니다."
        ),
        tags = {
                @Tag(name = "관리자", description = "관리자 전용 API"),
                @Tag(name = "공용", description = "고객용 API")
        }
)
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

    @Bean
    public GroupedOpenApi imageApi() {
        return GroupedOpenApi.builder()
                .group("이미지")
                .pathsToMatch("/api/images", "/api/images/**")
                .build();
    }
}

