package com.programmers.be14.nbe12141team03;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class Nbe12141Team03Application {
    static void main(String[] args) {

        // .env 파일 로드 (환경 변수 파일이 존재하지 않더라도 오류가 나지 않도록 설정)
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        // .env의 모든 항목을 시스템 프로퍼티로 등록
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(Nbe12141Team03Application.class, args);
    }
}
