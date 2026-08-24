package com.programmers.be14.nbe12141team03;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class Nbe12141Team03Application {
    static void main(String[] args) {
        SpringApplication.run(Nbe12141Team03Application.class, args);
    }
}
