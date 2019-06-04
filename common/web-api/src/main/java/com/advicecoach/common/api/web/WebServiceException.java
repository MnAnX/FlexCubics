package com.advicecoach.common.api.web;

/**
 * Created by nan on 10/2/2016.
 */
public class WebServiceException extends Exception {
    public WebServiceException(String error) {
        super(error);
    }

    public WebServiceException(String error, Exception e) {
        super(error, e);
    }
}
