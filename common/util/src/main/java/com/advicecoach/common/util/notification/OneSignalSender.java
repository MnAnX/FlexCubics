package com.advicecoach.common.util.notification;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.Inject;
import com.google.inject.name.Named;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

/**
 * Created by nan on 3/8/2017.
 */
@Slf4j
public class OneSignalSender {
    public static final String ONESIGNAL_URL = "oneSignalUrl";
    public static final String AUTHORIZATION = "oneSignalAuthorization";
    public static final String APP_ID = "oneSignalAppId";

    private final String oneSignalUrl;
    private final String authorization;
    private final String oneSignalAppId;

    private Gson gson;

    @Inject
    public OneSignalSender(@Named(ONESIGNAL_URL) final String oneSignalUrl, @Named(AUTHORIZATION) final String authorization, @Named(APP_ID) final String oneSignalAppId) {
        this.oneSignalUrl = oneSignalUrl;
        this.authorization = authorization;
        this.oneSignalAppId = oneSignalAppId;

        gson = new GsonBuilder().create();
    }

    public String sendNotification(OneSignalNotification notification) throws OneSignalException {
        try {
            notification.setApp_id(oneSignalAppId);
            String strJsonBody = gson.toJson(notification);
            log.debug("Sending notification:\n" + strJsonBody);
            byte[] sendBytes;
            try {
                sendBytes = strJsonBody.getBytes("UTF-8");
            } catch (UnsupportedEncodingException e) {
                throw new OneSignalException("Unable to parse notification message: " + e.getMessage(), e);
            }

            HttpURLConnection con;
            try {
                con = getConnection();
            } catch (Exception e) {
                throw new OneSignalException("Unable to connect to OneSignal: " + e.getMessage(), e);
            }
            con.setFixedLengthStreamingMode(sendBytes.length);

            try {
                OutputStream outputStream = con.getOutputStream();
                outputStream.write(sendBytes);
            } catch (IOException e) {
                throw new OneSignalException("Unable to send message to OneSignal: " + e.getMessage(), e);
            }

            try {
                String jsonResponse;
                int httpResponse = con.getResponseCode();
                log.debug("httpResponse: " + httpResponse);
                if (httpResponse >= HttpURLConnection.HTTP_OK
                        && httpResponse < HttpURLConnection.HTTP_BAD_REQUEST) {
                    Scanner scanner = new Scanner(con.getInputStream(), "UTF-8");
                    jsonResponse = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
                    scanner.close();
                } else {
                    Scanner scanner = new Scanner(con.getErrorStream(), "UTF-8");
                    jsonResponse = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
                    scanner.close();
                }
                return jsonResponse;
            } catch (IOException e) {
                throw new OneSignalException("Error getting response from OneSignal: " + e.getMessage(), e);
            }
        } catch (Exception e) {
            throw new OneSignalException("Error sending notification. Error: " + e.getMessage(), e);
        }
    }

    private HttpURLConnection getConnection() throws Exception {
        URL url = new URL(oneSignalUrl);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setUseCaches(false);
        con.setDoOutput(true);
        con.setDoInput(true);
        con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        con.setRequestProperty("Authorization", authorization);
        con.setRequestMethod("POST");
        con.setConnectTimeout(5000);
        con.setReadTimeout(5000);
        return con;
    }

    public class OneSignalException extends Exception {
        public OneSignalException(String err, Exception e) {
            super(err, e);
        }
    }
}
