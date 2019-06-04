package com.advicecoach.common.api.web;

public class CommunicationServiceException extends Exception {
    public CommunicationServiceException(String error) {
        super(error);
    }

    public CommunicationServiceException(String error, Exception e) {
        super(error, e);
    }
}
