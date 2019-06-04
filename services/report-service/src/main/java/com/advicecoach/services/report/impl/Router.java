package com.advicecoach.services.report.impl;

import com.advicecoach.common.api.report.comm.RequestWrap;
import com.advicecoach.common.api.report.comm.ResponseWrap;
import com.advicecoach.common.api.report.error.ErrorEnum;
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
    private final ReportServiceImpl service;
    private final Gson gson;

    @Inject
    public Router(final ReportServiceImpl service) {
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
        funcMap.put("/UserLogin", request -> handlePost(request, r -> service.userLogin(r)));
        funcMap.put("/GetUserApps", request -> handlePost(request, r -> service.getUserApps(r)));
        funcMap.put("/GetAppInfo", request -> handlePost(request, r -> service.getAppInfo(r)));
        funcMap.put("/GetAppUsers", request -> handlePost(request, r -> service.getAppUsers(r)));
        funcMap.put("/GetCustomApp", request -> handlePost(request, r -> service.getCustomApp(r)));
        funcMap.put("/SendEmail", request -> handlePost(request, r -> service.sendEmail(r)));
        funcMap.put("/GetUserInfo", request -> handlePost(request, r -> service.getUserInfo(r)));
        funcMap.put("/FindUserByEmail", request -> handlePost(request, r -> service.findUserByEmail(r)));
        funcMap.put("/GetAllPublishedApps", request -> handlePost(request, r -> service.getAllPublishedApps(r)));
        funcMap.put("/GetAllNonPublishedApps", request -> handlePost(request, r -> service.getAllNonPublishedApps(r)));
        funcMap.put("/GetAllAppCreators", request -> handlePost(request, r -> service.getAllAppCreators(r)));
        funcMap.put("/PublishApp", request -> handlePost(request, r -> service.publishApp(r)));
        funcMap.put("/UnpublishApp", request -> handlePost(request, r -> service.unpublishApp(r)));
        funcMap.put("/AddAppToUser", request -> handlePost(request, r -> service.addAppToUser(r)));
        funcMap.put("/InvalidateApp", request -> handlePost(request, r -> service.invalidateApp(r)));
        funcMap.put("/GetAppUserInfo", request -> handlePost(request, r -> service.getAppUserInfo(r)));
        funcMap.put("/LockApp", request -> handlePost(request, r -> service.lockApp(r)));
        funcMap.put("/GetNewCustomAppsData", request -> handlePost(request, r -> service.getNewCustomAppsData(r)));
        funcMap.put("/CreateNewOrganization", request -> handlePost(request, r -> service.createNewOrganization(r)));
        funcMap.put("/GetUserBehaviorData", request -> handlePost(request, r -> service.getUserBehaviorData(r)));
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
