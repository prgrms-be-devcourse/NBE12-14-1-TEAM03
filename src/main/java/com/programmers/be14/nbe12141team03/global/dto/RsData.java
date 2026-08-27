package com.programmers.be14.nbe12141team03.global.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class RsData<T> {

    private String resultCode;
    private String msg;
    private T data;

    public RsData(String resultCode, String msg) {
        this.resultCode = resultCode;
        this.data = null;
        this.msg = msg;
    }


    public int getStatusCode(){
        return Integer.parseInt(this.resultCode.split("-")[0]);
    }
}
