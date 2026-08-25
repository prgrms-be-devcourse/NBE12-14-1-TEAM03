package com.programmers.be14.nbe12141team03.global.exception;

import com.programmers.be14.nbe12141team03.global.dto.RsData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiServiceException.class)
    public ResponseEntity<RsData<?>> handleApiServiceException(ApiServiceException e) {
        RsData<?> rsData = e.getRsData();
        return ResponseEntity.status(rsData.getStatusCode()) // "404-1" -> 404 코드 반환
                .body(rsData);
    }
}
