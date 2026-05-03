package com.cloud.common.exception;

import com.cloud.common.core.R;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public R<?> handleException(Exception e) {
        return R.fail(e.getMessage());
    }
}
