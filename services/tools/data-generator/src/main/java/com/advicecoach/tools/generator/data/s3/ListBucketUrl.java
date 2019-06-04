package com.advicecoach.tools.generator.data.s3;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.Protocol;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3ObjectSummary;

import java.net.URL;
import java.util.List;

/**
 * Created by Nan on 5/23/2017.
 */
public class ListBucketUrl {
    public static final String AWS_ACCESS_KEY_ID = "AKIAIPUVYOHGPVGYBDLA";
    public static final String AWS_SECRET_ACCESS_KEY = "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";
    public static final String BUCKET_NAME = "template-image-storage";
    public static final String BASE_PATH = "Apps/";

    public static final String APP_NAME = "No Excuses";
    public static final String CATEGORY_NAME = "Tell Your Story";

    public static void main(String[] args) {
        ListBucketUrl l = new ListBucketUrl();
        String path = new StringBuilder(BASE_PATH).append(APP_NAME).append("/categories/").append(CATEGORY_NAME).append("/").toString();
        l.getUrls(path);
    }

    public void getUrls(String path) {
        AmazonS3 s3 = getS3Client();
        ObjectListing ol = s3.listObjects(BUCKET_NAME);
        List<S3ObjectSummary> objects = ol.getObjectSummaries();
        for (S3ObjectSummary os : objects) {
            if (os.getKey().startsWith(path) && !os.getKey().equals(path)) {
                URL url = s3.getUrl(BUCKET_NAME, os.getKey());
                System.out.println("\"" + url + "\"");
            }
        }
    }

    private AmazonS3 getS3Client() {
        AWSCredentials credentials = new BasicAWSCredentials(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);
        ClientConfiguration clientConfig = new ClientConfiguration();
        clientConfig.setProtocol(Protocol.HTTP);
        return new AmazonS3Client(credentials, clientConfig);
    }
}
