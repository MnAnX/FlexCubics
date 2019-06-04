package com.advicecoach.services.web.impl.modules;

import com.amazonaws.*;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.Headers;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ResponseHeaderOverrides;
import com.google.inject.Inject;
import com.google.inject.name.Named;
import lombok.extern.slf4j.Slf4j;

import java.net.URL;


/**
 * Created by nan on 3/19/2017.
 */
@Slf4j
public class AwsProcessor {
    public static final String AWS_ACCESS_KEY_ID = "awsAccessKeyId";
    public static final String AWS_SECRET_ACCESS_KEY = "awsSecretAccessKey";

    private final String awsAccessKeyId;
    private final String awsSecretAccessKey;


    @Inject
    public AwsProcessor(@Named(AWS_ACCESS_KEY_ID) final String awsAccessKeyId,
                        @Named(AWS_SECRET_ACCESS_KEY) final String awsSecretAccessKey) {

        this.awsAccessKeyId = awsAccessKeyId;
        this.awsSecretAccessKey = awsSecretAccessKey;
    }

    public String getS3SignedUrl(String bucketName, String objectKey, String contentType) throws AwsException {
        AmazonS3 s3client = getS3Client();

        try {
            System.out.println("Generating pre-signed URL.");
            java.util.Date expiration = new java.util.Date();
            long milliSeconds = expiration.getTime();
            milliSeconds += 1000 * 60; // Add 1 min.
            expiration.setTime(milliSeconds);

            GeneratePresignedUrlRequest generatePresignedUrlRequest =
                    new GeneratePresignedUrlRequest(bucketName, objectKey);
            generatePresignedUrlRequest.setMethod(HttpMethod.PUT);
            generatePresignedUrlRequest.setExpiration(expiration);
            generatePresignedUrlRequest.setContentType(contentType);
            generatePresignedUrlRequest.addRequestParameter(
                    Headers.S3_CANNED_ACL,
                    CannedAccessControlList.PublicRead.toString()
            );

            URL url = s3client.generatePresignedUrl(generatePresignedUrlRequest);

            String signedUrl = url.toString();

            log.debug("Pre-Signed URL = " + signedUrl);

            return signedUrl;
        } catch (AmazonServiceException exception) {
            log.debug("Caught an AmazonServiceException, " +
                    "which means your request made it " +
                    "to Amazon S3, but was rejected with an error response " +
                    "for some reason.");
            log.debug("Error Message: " + exception.getMessage());
            log.debug("HTTP  Code: "    + exception.getStatusCode());
            log.debug("AWS Error Code:" + exception.getErrorCode());
            log.debug("Error Type:    " + exception.getErrorType());
            log.debug("Request ID:    " + exception.getRequestId());

            throw new AwsException("AWS rejected with error response: " + exception.getMessage(), exception);
        } catch (AmazonClientException ace) {
            log.debug("Caught an AmazonClientException, " +
                    "which means the client encountered " +
                    "an internal error while trying to communicate" +
                    " with S3, " +
                    "such as not being able to access the network.");
            log.debug("Error Message: " + ace.getMessage());
            throw new AwsException("AWS communication error: " + ace.getMessage(), ace);
        }
    }

    private AmazonS3 getS3Client() {
        AWSCredentials credentials = new BasicAWSCredentials(awsAccessKeyId, awsSecretAccessKey);
        ClientConfiguration clientConfig = new ClientConfiguration();
        clientConfig.setProtocol(Protocol.HTTP);
        return new AmazonS3Client(credentials, clientConfig);
    }

    // Helper

    public class AwsException extends Exception {
        public AwsException(String err, Exception e) {
            super(err, e);
        }
    }
}
