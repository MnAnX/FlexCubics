package com.advicecoach.common.api.report;

/**
 * Created by nan on 10/2/2016.
 */
public class ReportServiceException extends Exception {
    public ReportServiceException(String error) {
        super(error);
    }

    public ReportServiceException(String error, Exception e) {
        super(error, e);
    }
}
