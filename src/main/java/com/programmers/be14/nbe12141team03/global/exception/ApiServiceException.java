package com.programmers.be14.nbe12141team03.global.exception;

import com.programmers.be14.nbe12141team03.global.dto.RsData;
import lombok.Getter;

@Getter
public class ApiServiceException extends RuntimeException {

    private final RsData<?> rsData;
    public ApiServiceException(String resultCode, String msg) {
        super(msg);
        this.rsData = new RsData<>(resultCode, msg);
    }

    // 사용 예시:
    //
    // if (예외 상황 검증 로직) {
    //     throw new ApiServiceException("404-1", "오류 메세지를 입력합니다.");
    // }
}
