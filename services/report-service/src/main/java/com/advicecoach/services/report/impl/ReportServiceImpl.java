package com.advicecoach.services.report.impl;

import com.advicecoach.common.api.report.data.*;
import com.advicecoach.common.api.report.comm.RequestWrap;
import com.advicecoach.common.api.report.comm.ResponseWrap;
import com.advicecoach.common.api.report.error.ErrorEnum;
import com.advicecoach.common.api.report.msg.*;
import com.advicecoach.common.datamodel.app.AppData;
import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppStatus;
import com.advicecoach.common.datamodel.custom.CustomApp;
import com.advicecoach.common.datamodel.organization.OrgData;
import com.advicecoach.common.datamodel.organization.OrgInfo;
import com.advicecoach.common.datamodel.user.UserProfile;
import com.advicecoach.common.util.mysql.MySqlDataConnector;
import com.advicecoach.services.report.impl.data.DatabaseAccess;
import com.advicecoach.services.report.impl.data.DatabaseReadOnlyAccess;
import com.advicecoach.services.report.impl.modules.*;
import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;
import java.util.Map;

/**
 * Created by nan on 10/1/2016.
 */
@Slf4j
public class ReportServiceImpl {
    private final Gson gson;

    private final DatabaseAccess db;
    private final DatabaseReadOnlyAccess dbro;
    private final LoginProcessor loginProcessor;
    private final ErrorEmailSender errorEmailSender;
    private final UserEmailSender userEmailSender;

    @Inject
    public ReportServiceImpl(
            final DatabaseAccess db,
            final DatabaseReadOnlyAccess dbro,
            final LoginProcessor loginProcessor,
            final ErrorEmailSender errorEmailSender,
            final UserEmailSender userEmailSender) throws Exception {
        this.gson = new GsonBuilder().create();

        this.db = db;
        this.dbro = dbro;
        this.loginProcessor = loginProcessor.setDb(this.db);
        this.errorEmailSender = errorEmailSender;
        this.userEmailSender = userEmailSender;
    }

    public ResponseWrap<UserLoginResp> userLogin(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                UserLoginReq.class,
                ErrorEnum.UserLogin,
                req -> {
                    // Validate email
                    if (req.getUserInfo() == null || req.getUserInfo().getEmail() == null || req.getUserInfo().getEmail().isEmpty()) {
                        return "Missing email.";
                    }
                    return null;
                },
                req -> {
                    UserLoginResp ret = loginProcessor.processUserLogin(req);
                    return ret;
                });
    }

    public ResponseWrap<GetUserAppsResp> getUserApps(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetUserAppsReq.class,
                ErrorEnum.GetUserApps,
                req -> {
                    // Validate user ID
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    return null;
                },
                req -> {
                    GetUserAppsResp ret = new GetUserAppsResp();

                    // get all user apps
                    Map<Integer, AppInfoData> allUserApps = db.getAllUserApps(req.getUserId());

                    ret.setApps(allUserApps);
                    return ret;
                });
    }

    public ResponseWrap<GetAppInfoResp> getAppInfo(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetAppInfoReq.class,
                ErrorEnum.GetAppInfo,
                req -> {
                    // Validate user ID
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    // Validate app ID
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    return null;
                },
                req -> {
                    GetAppInfoResp ret = new GetAppInfoResp();

                    // Get app info
                    AppInfo appInfo;
                    if (req.getAppId() < 0) {
                        // new app, give back initialized data
                        appInfo = AppInfo.builder().build();
                    } else {
                        // retrieve app data from database
                        AppData appData = db.getAppData(req.getAppId());
                        appInfo = appData.getAppInfo();
                    }

                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    ret.setAppInfo(appInfo);
                    return ret;
                });
    }

    public ResponseWrap<GetAppUsersResp> getAppUsers(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetAppUsersReq.class,
                ErrorEnum.GetAppUsers,
                req -> {
                    // Validate user ID
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    // Validate app ID
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    return null;
                },
                req -> {
                    GetAppUsersResp ret = new GetAppUsersResp();

                    // get all user on this app
                    List<UserProfile> users = db.getAllUsersOnApp(req.getAppId());

                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    ret.setUsers(users);
                    return ret;
                });
    }

    public ResponseWrap<GetCustomAppResp> getCustomApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetCustomAppReq.class,
                ErrorEnum.GetCustomApp,
                req -> {
                    if (req.getAppId() == null) {
                        return "App ID is required.";
                    }
                    if (req.getAppUserId() == null) {
                        return "App User ID is required.";
                    }
                    return null;
                },
                req -> {
                    GetCustomAppResp ret = new GetCustomAppResp();

                    // get custom app
                    CustomApp customApp = null;
                    try{
                        customApp = db.getCustomAppByUserAndAppId(req.getAppUserId(), req.getAppId()).getCustomApp();
                    } catch(MySqlDataConnector.DataNotFoundException e) {
                        log.debug("Custom app for app [{}] by user [{}] is not found", req.getAppId(), req.getAppUserId());
                        // return empty custom app
                    }

                    ret.setAppId(req.getAppId());
                    ret.setAppUserId(req.getAppUserId());
                    ret.setCustomApp(customApp);
                    return ret;
                });
    }

    public ResponseWrap<SendEmailResp> sendEmail(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                SendEmailReq.class,
                ErrorEnum.SendEmail,
                req -> {
                    if (req.getUserId() == null) {
                        return "User ID is required.";
                    }
                    if (req.getRecipient() == null) {
                        return "Email recipient is required.";
                    }
                    if (req.getSubject() == null) {
                        return "Email subject is required.";
                    }
                    return null;
                },
                req -> {
                    SendEmailResp ret = new SendEmailResp();

                    // send email
                    userEmailSender.sendEmail(req.getRecipient(), req.getSender(), req.getSubject(), req.getText());

                    ret.setUserId(req.getUserId());
                    ret.setIsSuccessful(true);
                    return ret;
                });
    }

    public ResponseWrap<GetUserInfoResp> getUserInfo(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetUserInfoReq.class,
                ErrorEnum.GetUserInfo,
                req -> {
                    // Validate user ID
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    return null;
                },
                req -> {
                    GetUserInfoResp ret = new GetUserInfoResp();

                    // get user info
                    UserInfoData userInfo = db.getUserInfo(req.getUserId());

                    ret.setUserId(req.getUserId());
                    ret.setUserInfo(userInfo);
                    return ret;
                });
    }

    public ResponseWrap<FindUserByEmailResp> findUserByEmail(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                FindUserByEmailReq.class,
                ErrorEnum.FindUserByEmail,
                req -> {
                    // Validate user ID
                    if (req.getEmail() == null) {
                        return "Missing email.";
                    }
                    return null;
                },
                req -> {
                    FindUserByEmailResp ret = new FindUserByEmailResp();

                    UserInfoData userInfo = null;
                    // get user id
                    Integer userId = db.findUserID(req.getEmail());
                    if(userId > 0) {
                        // get user info
                        userInfo = db.getUserInfo(userId);
                    }

                    ret.setEmail(req.getEmail());
                    ret.setUserId(userId);
                    ret.setUserInfo(userInfo);
                    return ret;
                });
    }

    public ResponseWrap<GetUserAppsResp> getAllPublishedApps(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetUserAppsReq.class,
                ErrorEnum.GetUserApps,
                req -> null,
                req -> {
                    GetUserAppsResp ret = new GetUserAppsResp();

                    // get all published apps
                    Map<Integer, AppInfoData> allApps = db.getAllPublishedApps();

                    ret.setApps(allApps);
                    return ret;
                });
    }

    public ResponseWrap<GetUserAppsResp> getAllNonPublishedApps(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetUserAppsReq.class,
                ErrorEnum.GetUserApps,
                req -> null,
                req -> {
                    GetUserAppsResp ret = new GetUserAppsResp();

                    // get all non-published apps
                    Map<Integer, AppInfoData> allApps = db.getAllNonPublishedApps();

                    ret.setApps(allApps);
                    return ret;
                });
    }

    public ResponseWrap<GetAppUsersResp> getAllAppCreators(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetAppUsersReq.class,
                ErrorEnum.GetAppUsers,
                req -> null,
                req -> {
                    GetAppUsersResp ret = new GetAppUsersResp();

                    // get all app creators
                    List<UserProfile> creators = db.getAllAppCreators();

                    ret.setUsers(creators);
                    return ret;
                });
    }

    public ResponseWrap<PublishAppResp> publishApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                PublishAppReq.class,
                ErrorEnum.PublishApp,
                req -> {
                    // Validate user ID
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    // Validate app ID
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    return null;
                },
                req -> {
                    PublishAppResp ret = new PublishAppResp();

                    // Publish the app
                    // Default status of published app is Private
                    AppStatus status = AppStatus.Published;
                    try{
                        AppData appData = db.getAppData(req.getAppId());
                        AppInfo appInfo = appData.getAppInfo();
                        if(appInfo.getAppStatus().getVal() > 50) {
                            // not published yet, keep on publishing
                            appInfo.setAppStatus(status);
                            db.publishApp(req.getAppId(), appInfo);
                            ret.setMessage("Playbook is published");
                        } else {
                            // already published
                            ret.setMessage("Error: This Playbook has already been published");
                        }
                        ret.setAppInfo(appInfo);
                    } catch(MySqlDataConnector.DataNotFoundException e) {
                        // Invalid app ID
                        ret.setMessage("Error: Invalid Playbook ID");
                    }

                    // Set other return data
                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());

                    return ret;
                });
    }

    public ResponseWrap<PublishAppResp> unpublishApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                PublishAppReq.class,
                ErrorEnum.PublishApp,
                req -> {
                    // Validate user ID
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    // Validate app ID
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    return null;
                },
                req -> {
                    PublishAppResp ret = new PublishAppResp();

                    // Un-publish the app
                    // Default status of unpublished app is Editing
                    AppStatus status = AppStatus.Editing;
                    try{
                        AppData appData = db.getAppData(req.getAppId());
                        AppInfo appInfo = appData.getAppInfo();
                        if(appInfo.getAppStatus().getVal() < 50) {
                            // it is published, let's unpublish
                            appInfo.setAppStatus(status);
                            db.publishApp(req.getAppId(), appInfo);  // publish function still works in this case
                            ret.setMessage("Playbook is unpublished");
                        } else {
                            // it is currently not published
                            ret.setMessage("Error: This Playbook is currently not published");
                        }
                        ret.setAppInfo(appInfo);
                    } catch(MySqlDataConnector.DataNotFoundException e) {
                        // Invalid app ID
                        ret.setMessage("Error: Invalid Playbook ID");
                    }

                    // Set other return data
                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());

                    return ret;
                });
    }

    public ResponseWrap<AddAppToUserResp> addAppToUser(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                AddAppToUserReq.class,
                ErrorEnum.AddAppToUser,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    return null;
                },
                req -> {
                    AddAppToUserResp ret = new AddAppToUserResp();

                    // add app to the user
                    db.addAppToUser(req.getUserId(), req.getAppId());

                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    return ret;
                });
    }

    public ResponseWrap<InvalidateAppResp> invalidateApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                InvalidateAppReq.class,
                ErrorEnum.InvalidateApp,
                req -> {
                    // Validate user ID
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    // Validate app ID
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    return null;
                },
                req -> {
                    InvalidateAppResp ret = new InvalidateAppResp();

                    // invalidate app
                    db.invalidateApp(req.getUserId(), req.getAppId());
                    // get all user apps
                    Map<Integer, AppInfoData> allUserApps = db.getAllUserApps(req.getUserId());

                    ret.setUserId(req.getUserId());
                    ret.setApps(allUserApps);
                    return ret;
                });
    }

    public ResponseWrap<GetAppUserInfoResp> getAppUserInfo(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetAppUserInfoReq.class,
                ErrorEnum.GetAppUserInfo,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    return null;
                },
                req -> {
                    GetAppUserInfoResp ret = new GetAppUserInfoResp();

                    // get app user info
                    AppUserData appUserData = new AppUserData();
                    UserInfoData userInfo = db.getUserInfo(req.getUserId());
                    CustomAppData customAppData = null;
                    try {
                        customAppData = db.getCustomAppByUserAndAppId(req.getUserId(), req.getAppId());
                    } catch (MySqlDataConnector.DataNotFoundException e) {
                        // user has not setup custom app on this app yet
                        // do nothing
                    }
                    appUserData.setUserInfo(userInfo.getUserInfo());
                    appUserData.setUserRegTime(userInfo.getCreatedTime());
                    if(customAppData != null) {
                        appUserData.setCustomAppCreatedTime(customAppData.getCreatedTime());
                        appUserData.setCustomAppUpdatedTime(customAppData.getUpdatedTime());
                    }

                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    ret.setAppUserData(appUserData);
                    return ret;
                });
    }

    public ResponseWrap<LockAppResp> lockApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                LockAppReq.class,
                ErrorEnum.LockApp,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    return null;
                },
                req -> {
                    LockAppResp ret = new LockAppResp();

                    // update app info with lock
                    AppInfo appInfo = db.getAppData(req.getAppId()).getAppInfo();
                    appInfo.setLocked(req.isLocked());
                    if(req.isLocked()) {
                        appInfo.setLockCode(req.getLockCode());
                    }
                    db.updateAppInfo(req.getAppId(), appInfo);

                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    return ret;
                });
    }

    public ResponseWrap<GetActiveCustomAppsDataResp> getNewCustomAppsData(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetActiveCustomAppsDataReq.class,
                ErrorEnum.GetActiveCustomAppsData,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if (req.getRangeInDays() == null) {
                        return "Missing range in days.";
                    }
                    return null;
                },
                req -> {
                    GetActiveCustomAppsDataResp ret = new GetActiveCustomAppsDataResp();

                    // get new custom apps data
                    List<CustomAppUserData> newCustomAppsData = db.getNewCustomAppsData(req.getRangeInDays());

                    ret.setUserId(req.getUserId());
                    ret.setCustomAppsData(newCustomAppsData);
                    return ret;
                });
    }

    public ResponseWrap<CreateNewOrganizationResp> createNewOrganization(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                CreateNewOrganizationReq.class,
                ErrorEnum.CreateNewOrganization,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if (req.getShortName() == null) {
                        return "Missing organization short name.";
                    }
                    if (req.getAdminUserEmail() == null || req.getAdminUserEmail().isEmpty()) {
                        return "Missing admin user email.";
                    }
                    if (req.getOrgName() == null) {
                        return "Missing organization name.";
                    }
                    return null;
                },
                req -> {
                    CreateNewOrganizationResp ret = new CreateNewOrganizationResp();

                    String message = null;
                    Integer orgId = null;
                    // validate admin user, and get admin user ID
                    Integer adminUserId = db.findUserID(req.getAdminUserEmail());
                    if(adminUserId > 0) {
                        // valid admin user
                        // create new organization and insert in database
                        OrgInfo orgInfo = new OrgInfo();
                        orgInfo.setShortName(req.getShortName());
                        orgInfo.setAdminUserId(adminUserId);
                        orgInfo.setOrgName(req.getOrgName());
                        orgInfo.setOrgDescription(req.getOrgDescription());
                        OrgData orgData = new OrgData();  // init with empty org data

                        try {
                            orgId = db.createNewOrganization(req.getShortName(), orgInfo, orgData, adminUserId);
                            message = "New organization with short name <" + req.getShortName() + "> is created! Organization ID: " + orgId;
                        } catch (SQLIntegrityConstraintViolationException e) {
                            // duplicate key - short_name
                            message = "Error: Organization with short name <" + req.getShortName() + "> already exists!";
                        }

                        // add org to the admin user
                        if(orgId != null) {
                            db.addUserToOrganization(adminUserId, orgId);
                        }
                    } else {
                        // cannot find admin user ID
                        message = "Error: User with email <" + req.getAdminUserEmail() + "> does NOT exist! We cannot create organization under an invalid admin user.";
                    }

                    ret.setUserId(req.getUserId());
                    ret.setShortName(req.getShortName());
                    ret.setMessage(message);
                    ret.setAdminUserId(adminUserId);
                    ret.setOrgId(orgId);
                    return ret;
                });
    }

    public ResponseWrap<GetUserBehaviorDataResp> getUserBehaviorData(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetUserBehaviorDataReq.class,
                ErrorEnum.GetUserBehaviorData,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if(req.getType() == null) {
                        return "Missing behavior data type";
                    }
                    if (req.getRangeInDays() == null) {
                        return "Missing range in days.";
                    }
                    return null;
                },
                req -> {
                    GetUserBehaviorDataResp ret = new GetUserBehaviorDataResp();

                    // get user behavior data
                    List<UserBehaviorData> appUsersBehavior = Lists.newArrayList();
                    switch (req.getType()) {
                        case User:
                            appUsersBehavior = dbro.getAppUsersBehavior(req.getRangeInDays());
                            break;
                        case Creator:
                            appUsersBehavior = dbro.getAppCreatorsBehavior(req.getRangeInDays());
                            break;
                    }

                    ret.setUserId(req.getUserId());
                    ret.setType(req.getType());
                    ret.setUserBehaviorData(appUsersBehavior);
                    return ret;
                });
    }

    // Helpers

    private <I, O> ResponseWrap<O> process(RequestWrap<String> requestWrap,
                                           Class<I> requestType,
                                           ErrorEnum errorEnum,
                                           Function<I, String> validateFn,
                                           Function<I, O> processRequestFn) {
        ResponseWrap<O> resp = new ResponseWrap<>();
        String uri = requestWrap.getUri();
        I req;
        // Parse request
        try {
            req = gson.fromJson(requestWrap.getRequest(), requestType);
        } catch (Exception e) {
            resp.setError(errorEnum.getError().setDescription("Invalid request format: " + e.getMessage()));
            errorEmailSender.sendError("Request", uri, requestWrap.getRequest(), "Invalid request format.", e);
            return resp;
        }
        if (req == null) {
            resp.setError(errorEnum.getError().setDescription("Invalid empty request."));
            errorEmailSender.sendError("Request", uri, requestWrap.getRequest(), "Invalid empty request.", null);
            return resp;
        }
        // Validate request
        try {
            String err = validateFn.apply(req);
            if (err != null && !err.isEmpty()) {
                resp.setError(errorEnum.getError().setDescription(err));
                errorEmailSender.sendError("Validation", uri, requestWrap.getRequest(), err, null);
                return resp;
            }
        } catch (Exception e) {
            resp.setError(errorEnum.getError().setDescription("Request validation error: " + e.getMessage()));
            return resp;
        }
        // Process request
        try {
            O ret = processRequestFn.apply(req);
            resp.setResponse(ret);
        } catch (Exception e) {
            String error = "Failed to process: " + e.getMessage();
            log.error(error, e);
            resp.setError(errorEnum.getError().setDescription(error));
            errorEmailSender.sendError("Process", uri, requestWrap.getRequest(), errorEnum.toString(), e);
        }
        return resp;
    }

    @FunctionalInterface
    public interface Consumer<T> {
        void accept(T t) throws Exception;
    }

    @FunctionalInterface
    public interface Function<T, R> {
        R apply(T t) throws Exception;
    }
}
