package com.advicecoach.common.api.mobile;

/**
 * Created by nan on 10/2/2016.
 */
public class MobileServiceException extends Exception {
    public MobileServiceException(String error) {
        super(error);
    }

    public MobileServiceException(String error, Exception e) {
        super(error, e);
    }
}
