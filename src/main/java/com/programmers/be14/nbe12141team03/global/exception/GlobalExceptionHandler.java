package com.programmers.be14.nbe12141team03.global.exception;

import com.programmers.be14.nbe12141team03.global.dto.RsData;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiServiceException.class)
    public ResponseEntity<RsData<?>> handleApiServiceException(ApiServiceException e) {
        RsData<?> rsData = e.getRsData();
        return ResponseEntity.status(rsData.getStatusCode()) // "404-1" -> 404 코드 반환
                .body(rsData);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RsData<Map<String, String>>>
            handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {

        // 모든 필드 에러를 { "필드명": "오류 메세지" } 형태로 수집
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));

        // 가장 첫 번째 에러 메세지를 대표 메세지로 사용 (또는 기본 메세지)
        String defaultMsg = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .orElse("잘못된 요청입니다.");

        RsData<Map<String, String>> rsData =
                new RsData<>("400-1", defaultMsg, errors);

        return ResponseEntity.status(rsData.getStatusCode()).body(rsData);
    }

    //
    // 응답 예시 :
    //
    // {
    //     "resultCode": "400-1",
    //     "msg": "상품명은 필수입니다.",
    //     "data": {
    //          "name": "상품명은 필수입니다.",
    //          "price": "가격은 0원 이상이어야 합니다."
    //     }
    // }
    //

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<RsData<?>> handleHandlerMethodValidationException(
            HandlerMethodValidationException e
    ){
        String defaultMsg = e.getParameterValidationResults().stream()
                .flatMap(result -> result.getResolvableErrors().stream())
                .findFirst()
                .map(MessageSourceResolvable::getDefaultMessage)
                .orElse("잘못된 요청입니다.");

        RsData<?> rsData = new RsData<>(
                "400-1",
                defaultMsg
        );

        return ResponseEntity.status(rsData.getStatusCode()).body(rsData);
    }

    @ExceptionHandler(org.springframework.web.multipart.MaxUploadSizeExceededException.class)
    public ResponseEntity<RsData<Void>> handleMaxUploadSizeExceededException(
            org.springframework.web.multipart.MaxUploadSizeExceededException e
    ) {
        RsData<Void> rsData = new RsData<>(
                "400-1",
                "업로드 가능한 최대 파일 크기(10MB)를 초과했습니다."
        );

        return ResponseEntity.status(rsData.getStatusCode()).body(rsData);
    }
}

