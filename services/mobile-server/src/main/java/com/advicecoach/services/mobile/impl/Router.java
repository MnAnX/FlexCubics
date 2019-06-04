package com.advicecoach.services.mobile.impl;

import com.advicecoach.common.api.mobile.comm.RequestWrap;
import com.advicecoach.common.api.mobile.comm.ResponseWrap;
import com.advicecoach.common.api.mobile.error.ErrorEnum;
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
    private final MobileServiceImpl service;
    private final Gson gson;

    @Inject
    public Router(final MobileServiceImpl service) {
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
        funcMap.put("/GetAllAvailableApps", request -> handlePost(request, r -> service.getAllAvailableApps(r)));
        funcMap.put("/AddAppToUser", request -> handlePost(request, r -> service.addAppToUser(r)));
        funcMap.put("/RemoveAppFromUser", request -> handlePost(request, r -> service.removeAppFromUser(r)));
        funcMap.put("/GetCustomApp", request -> handlePost(request, r -> service.getCustomApp(r)));
        funcMap.put("/GetAppTemplate", request -> handlePost(request, r -> service.getAppTemplate(r)));
        funcMap.put("/CreateNewCustomApp", request -> handlePost(request, r -> service.createNewCustomApp(r)));
        funcMap.put("/CreateNewCustomAppLibraryOnly", request -> handlePost(request, r -> service.createNewCustomAppLibraryOnly(r)));
        funcMap.put("/AddCategoriesToCustomApp", request -> handlePost(request, r -> service.addCategoriesToCustomApp(r)));
        funcMap.put("/RemoveCategoriesFromCustomApp", request -> handlePost(request, r -> service.removeCategoriesFromCustomApp(r)));
        funcMap.put("/AddUserCategoryToCustomApp", request -> handlePost(request, r -> service.addUserCategoryToCustomApp(r)));
        funcMap.put("/ReorderCustomAppCategories", request -> handlePost(request, r -> service.reorderCustomAppCategories(r)));
        funcMap.put("/UpdateCustomAppReminder", request -> handlePost(request, r -> service.updateCustomAppReminder(r)));
        funcMap.put("/RemoveCustomAppReminder", request -> handlePost(request, r -> service.removeCustomAppReminder(r)));
        funcMap.put("/SubmitCustomCategoryAction", request -> handlePost(request, r -> service.submitCustomCategoryAction(r)));
        funcMap.put("/GetUserProfile", request -> handlePost(request, r -> service.getUserProfile(r)));
        funcMap.put("/GetUserNotes", request -> handlePost(request, r -> service.getUserNotes(r)));
        funcMap.put("/AddUserNote", request -> handlePost(request, r -> service.addUserNote(r)));
        funcMap.put("/RemoveUserNote", request -> handlePost(request, r -> service.removeUserNote(r)));
        funcMap.put("/UpdateUserNote", request -> handlePost(request, r -> service.updateUserNote(r)));
        funcMap.put("/SyncCustomApp", request -> handlePost(request, r -> service.syncCustomApp(r)));
        funcMap.put("/GetAppInfo", request -> handlePost(request, r -> service.getAppInfo(r)));
        funcMap.put("/GetPublishedApp", request -> handlePost(request, r -> service.getPublishedApp(r)));
        funcMap.put("/UpdateCustomAppCategory", request -> handlePost(request, r -> service.updateCustomAppCategory(r)));
        funcMap.put("/GetUserNotifications", request -> handlePost(request, r -> service.getUserNotifications(r)));
        funcMap.put("/AddCategoryFeedback", request -> handlePost(request, r -> service.addCategoryFeedback(r)));
        funcMap.put("/AddCustomAppGoal", request -> handlePost(request, r -> service.addCustomAppGoal(r)));
        funcMap.put("/UpdateCustomAppGoal", request -> handlePost(request, r -> service.updateCustomAppGoal(r)));
        funcMap.put("/RemoveCustomAppGoal", request -> handlePost(request, r -> service.removeCustomAppGoal(r)));
        funcMap.put("/AddCustomAppGoalProgress", request -> handlePost(request, r -> service.addCustomAppGoalProgress(r)));
        funcMap.put("/UpdateAppTemplate", request -> handlePost(request, r -> service.updateAppTemplate(r)));
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
                        wrap.setFileType(fileUpload.getContentType());
                        wrap.setData(fileUpload.get());
                    } catch (IOException e) {
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
