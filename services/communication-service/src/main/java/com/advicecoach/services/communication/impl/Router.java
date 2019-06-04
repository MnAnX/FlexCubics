package com.advicecoach.services.communication.impl;

import com.advicecoach.common.api.web.comm.RequestWrap;
import com.advicecoach.common.api.web.comm.ResponseWrap;
import com.advicecoach.common.api.web.error.ErrorEnum;
import com.google.api.client.util.Maps;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.Inject;
import io.netty.handler.codec.http.HttpRequest;
import io.netty.handler.codec.http.multipart.*;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Map;
import java.util.function.Function;

/**
 * Created by nan on 10/1/2016.
 */
@Slf4j
public class Router {
    private Map<String, Function<HttpRequest, String>> funcMap = Maps.newHashMap();
    private final CommunicationServiceImpl service;
    private final Gson gson;

    @Inject
    public Router(final CommunicationServiceImpl service) {
        this.service = service;
        this.gson = new GsonBuilder().create();
        initRouting();
    }

    public Map<String, Function<HttpRequest, String>> getFuncMap() {
        return funcMap;
    }

    // Routing

    private void initRouting() {
        funcMap.put("/HealthCheck", request -> "ok");
        funcMap.put("/SendEmail", request -> handlePost(request, r -> service.sendEmail(r)));
        funcMap.put("/GetUserNotifications", request -> handlePost(request, r -> service.getUserNotifications(r)));
        funcMap.put("/SendNotificationToUser", request -> handlePost(request, r -> service.sendNotificationToUser(r)));
        funcMap.put("/SendNotificationToApp", request -> handlePost(request, r -> service.sendNotificationToApp(r)));
        funcMap.put("/SetUserNotificationAsRead", request -> handlePost(request, r -> service.setUserNotificationAsRead(r)));
        funcMap.put("/RemoveNotification", request -> handlePost(request, r -> service.removeNotification(r)));
    }

    // Request parser

    private String handlePost(HttpRequest request, Function<RequestWrap, ResponseWrap> service) {
        String response;
        try {
            RequestWrap<String> req = getPostAttributes(request);
            log.debug("Request to [{}]: {}", request.uri(), req.toString());
            ResponseWrap resp = service.apply(req);
            resp.setID(req.getID());
            response = gson.toJson(resp);
            log.trace("Response of [{}]: {}", request.uri(), response);
        } catch (InvalidRequestException e) {
            response = createInvalidRequestResponse(e.getMessage());
        }
        return response;
    }

    private String createInvalidRequestResponse(String error) {
        ResponseWrap resp = new ResponseWrap();
        resp.setError(ErrorEnum.InvalidRequest.getError().setDescription(error));
        return gson.toJson(resp);
    }

    private RequestWrap<String> getPostAttributes(HttpRequest request) throws InvalidRequestException {
        RequestWrap<String> wrap = new RequestWrap<>();
        wrap.setUri(request.uri());
        HttpPostRequestDecoder decoder = new HttpPostRequestDecoder(new DefaultHttpDataFactory(false), request);
        try {
            // Parse request ID
            InterfaceHttpData id = decoder.getBodyHttpData("id");
            if (id != null) {
                if (id.getHttpDataType() == InterfaceHttpData.HttpDataType.Attribute) {
                    Attribute attribute = (Attribute) id;
                    try {
                        wrap.setID(attribute.getValue());
                    } catch (IOException e) {
                        throw new InvalidRequestException("Invalid request ID " + request.uri() + ": " + request.toString());
                    }
                } else {
                    throw new InvalidRequestException("Invalid request ID type: " + id.getHttpDataType());
                }
            }
            // Parse request body
            InterfaceHttpData data = decoder.getBodyHttpData("req");
            if (data == null) {
                throw new InvalidRequestException("Empty request body.");
            }
            if (data.getHttpDataType() == InterfaceHttpData.HttpDataType.Attribute) {
                Attribute attribute = (Attribute) data;
                try {
                    wrap.setRequest(attribute.getValue());
                } catch (IOException e) {
                    throw new InvalidRequestException("Invalid request body of " + request.uri() + ": " + request.toString());
                }
            } else {
                throw new InvalidRequestException("Invalid request type: " + data.getHttpDataType());
            }
            // Parse file upload
            InterfaceHttpData file = decoder.getBodyHttpData("file");
            if (file != null) {
                if (file.getHttpDataType() == InterfaceHttpData.HttpDataType.FileUpload) {
                    FileUpload fileUpload = (FileUpload) file;
                    try {
                        // Ignore
                    } catch (Exception e) {
                        log.info("Invalid file upload of " + request.uri() + ": " + e.getMessage(), e);
                        throw new InvalidRequestException("Invalid file upload of " + request.uri() + ": " + e.getMessage());
                    }
                } else {
                    throw new InvalidRequestException("Invalid file upload type: " + file.getHttpDataType());
                }
            }
            return wrap;
        } finally {
            decoder.destroy();
        }
    }

    class InvalidRequestException extends Exception {
        public InvalidRequestException(String e) {
            super(e);
        }
    }
}
