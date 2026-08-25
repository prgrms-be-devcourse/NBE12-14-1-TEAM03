package com.programmers.be14.nbe12141team03.domain.home.contoller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping(produces = MediaType.TEXT_HTML_VALUE)
    public String home() {
        return """
                <h1>안경잡이들</h1>
                <ul>
                    <li><a href="/swagger-ui/index.html">API 문서 (Swagger)</a></li>
                </ul>
                """;
    }
}
