package com.advicecoach.services.web.impl;

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
    private final WebServiceImpl service;
    private final Gson gson;

    @Inject
    public Router(final WebServiceImpl service) {
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
        funcMap.put("/GetS3SignedUrl", request -> handlePost(request, r -> service.getS3SignedUrl(r)));
        funcMap.put("/GetUserApps", request -> handlePost(request, r -> service.getUserApps(r)));
        funcMap.put("/GetAppInfo", request -> handlePost(request, r -> service.getAppInfo(r)));
        funcMap.put("/GetAppTemplate", request -> handlePost(request, r -> service.getAppTemplate(r)));
        funcMap.put("/CreateNewApp", request -> handlePost(request, r -> service.createNewApp(r)));
        funcMap.put("/UpdateAppInfo", request -> handlePost(request, r -> service.updateAppInfo(r)));
        funcMap.put("/UpdateAppTemplate", request -> handlePost(request, r -> service.updateAppTemplate(r)));
        funcMap.put("/StartTestingApp", request -> handlePost(request, r -> service.startTestingApp(r)));
        funcMap.put("/PublishApp", request -> handlePost(request, r -> service.publishApp(r)));
        funcMap.put("/GetAppUsers", request -> handlePost(request, r -> service.getAppUsers(r)));
        funcMap.put("/InviteUserToApp", request -> handlePost(request, r -> service.inviteUserToApp(r)));
        funcMap.put("/RemoveAppUser", request -> handlePost(request, r -> service.removeAppUser(r)));
        funcMap.put("/InvalidateApp", request -> handlePost(request, r -> service.invalidateApp(r)));
        funcMap.put("/SendEmail", request -> handlePost(request, r -> service.sendEmail(r)));
        funcMap.put("/SendPushNotificationToUser", request -> handlePost(request, r -> service.sendPushNotificationToUser(r)));
        funcMap.put("/SendPushNotificationToApp", request -> handlePost(request, r -> service.sendPushNotificationToApp(r)));
        funcMap.put("/GetUserInfo", request -> handlePost(request, r -> service.getUserInfo(r)));
        funcMap.put("/FindUserByEmail", request -> handlePost(request, r -> service.findUserByEmail(r)));
        funcMap.put("/GetOrgInfoData", request -> handlePost(request, r -> service.getOrgInfoData(r)));
        funcMap.put("/UpdateOrgData", request -> handlePost(request, r -> service.updateOrgData(r)));
        funcMap.put("/SubmitSubscription", request -> handlePost(request, r -> service.submitSubscription(r)));
        funcMap.put("/GetSubscriptionData", request -> handlePost(request, r -> service.getSubscriptionData(r)));
        funcMap.put("/GetAllMembersOfOrganization", request -> handlePost(request, r -> service.getAllMembersOfOrganization(r)));
        funcMap.put("/AddMemberToOrganization", request -> handlePost(request, r -> service.addMemberToOrganization(r)));
        funcMap.put("/RemoveMemberFromOrganization", request -> handlePost(request, r -> service.removeMemberFromOrganization(r)));
        funcMap.put("/SendEmailToAllOrgMembers", request -> handlePost(request, r -> service.sendEmailToAllOrgMembers(r)));
        funcMap.put("/EmailUserInstructions", request -> handlePost(request, r -> service.emailUserInstructions(r)));
        funcMap.put("/CloneApp", request -> handlePost(request, r -> service.cloneApp(r)));
        funcMap.put("/AddCustomCategoryToAppTemplate", request -> handlePost(request, r -> service.addCustomCategoryToAppTemplate(r)));
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
