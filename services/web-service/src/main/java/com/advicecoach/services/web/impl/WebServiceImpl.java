package com.advicecoach.services.web.impl;

import com.advicecoach.common.api.web.comm.RequestWrap;
import com.advicecoach.common.api.web.comm.ResponseWrap;
import com.advicecoach.common.api.web.data.AppTemplateData;
import com.advicecoach.common.api.web.data.OrgInfoData;
import com.advicecoach.common.api.web.data.SubData;
import com.advicecoach.common.api.web.error.ErrorEnum;
import com.advicecoach.common.api.web.msg.*;
import com.advicecoach.common.datamodel.app.AppData;
import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppStatus;
import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.common.datamodel.custom.CustomApp;
import com.advicecoach.common.datamodel.user.UserInfo;
import com.advicecoach.common.datamodel.user.UserProfile;
import com.advicecoach.common.util.mysql.MySqlDataConnector;
import com.advicecoach.services.web.impl.data.ConfigData;
import com.advicecoach.services.web.impl.data.DatabaseAccess;
import com.advicecoach.services.web.impl.modules.*;
import com.google.api.client.util.Lists;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

/**
 * Created by nan on 10/1/2016.
 */
@Slf4j
public class WebServiceImpl {
    private final DatabaseAccess db;
    private final Gson gson;

    private final LoginProcessor loginProcessor;
    private final ErrorEmailSender errorEmailSender;
    private final AppProcessor appProcessor;
    private final ConfigData configData;
    private final AwsProcessor awsProcessor;
    private final UserEmailSender userEmailSender;
    private final NotificationProcessor notificationProcessor;
    private final SubscriptionProcessor subscriptionProcessor;
    private final OrganizationProcessor organizationProcessor;
    private final EmailTemplateProcessor emailTemplateProcessor;
    private final InvitationProcessor invitationProcessor;

    @Inject
    public WebServiceImpl(final DatabaseAccess db,
                          final LoginProcessor loginProcessor,
                          final ErrorEmailSender errorEmailSender,
                          final AppProcessor appProcessor,
                          final AwsProcessor awsProcessor,
                          final ConfigData configData,
                          final UserEmailSender userEmailSender,
                          final NotificationProcessor notificationProcessor,
                          final SubscriptionProcessor subscriptionProcessor,
                          final OrganizationProcessor organizationProcessor,
                          final EmailTemplateProcessor emailTemplateProcessor,
                          final InvitationProcessor invitationProcessor) throws Exception {
        this.gson = new GsonBuilder().create();

        this.db = db;
        this.configData = configData.initialize();
        this.errorEmailSender = errorEmailSender;
        this.userEmailSender = userEmailSender;
        this.awsProcessor = awsProcessor;
        this.loginProcessor = loginProcessor.setDb(this.db);
        this.appProcessor = appProcessor.setConfigData(this.configData);
        this.notificationProcessor = notificationProcessor.setDb(this.db);
        this.subscriptionProcessor = subscriptionProcessor.setDb(this.db);
        this.organizationProcessor = organizationProcessor.setDb(this.db)
                .setEmailSender(this.userEmailSender)
                .setAppProcessor(this.appProcessor);
        this.emailTemplateProcessor = emailTemplateProcessor.init();
        this.invitationProcessor = invitationProcessor.setDb(this.db)
                .setEmailTemplateProcessor(this.emailTemplateProcessor);
    }

    public ResponseWrap<UserLoginResp> userLogin(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                UserLoginReq.class,
                ErrorEnum.UserLogin,
                req -> {
                    if (req.getUserInfo() == null) {
                        return "Missing login info.";
                    }
                    return null;
                },
                req -> {
                    UserLoginResp ret = new UserLoginResp();

                    Integer userId = loginProcessor.processUserLogin(req.getUserInfo());

                    ret.setUserId(userId);
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
                    Map<Integer, AppInfo> allUserApps = db.getAllUserApps(req.getUserId());

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

    public ResponseWrap<GetAppTemplateResp> getAppTemplate(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetAppTemplateReq.class,
                ErrorEnum.GetAppTemplate,
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
                    GetAppTemplateResp ret = new GetAppTemplateResp();

                    // Get app template
                    AppTemplateData appTemplateData;
                    if (req.getAppId() < 0) {
                        // new app, initialize app template
                        appTemplateData = appProcessor.convertToAppTemplateData(appProcessor.initializeNewAppTemplate(AppInfo.builder().build()));
                    } else {
                        // app already exists, retrieve app data from database
                        AppData appData = db.getAppData(req.getAppId());
                        appTemplateData = appProcessor.convertToAppTemplateData(appData.getAppTemplate());
                    }

                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    ret.setAppTemplate(appTemplateData);
                    return ret;
                });
    }

    public ResponseWrap<CreateNewAppResp> createNewApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                CreateNewAppReq.class,
                ErrorEnum.CreateNewApp,
                req -> {
                    // Validate user ID
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    // Validate app info
                    if (req.getAppInfo() == null) {
                        return "Missing app info.";
                    }
                    return null;
                },
                req -> {
                    CreateNewAppResp ret = new CreateNewAppResp();

                    // Create new app
                    UserInfo userInfo = db.getUserInfo(req.getUserId());
                    // Process and enhance appInfo
                    AppInfo appInfo = appProcessor.initializeNewAppInfo(req.getAppInfo());
                    // Initialize app template
                    AppTemplate appTemplate;
                    // Check if user is organization member
                    if(userInfo.getHasOrg()) {
                        // organization member, use organization template
                        OrgInfoData orgInfoData = organizationProcessor.getOrganizationInfoData(req.getUserId(), userInfo.getOrgId());
                        appTemplate = db.getAppData(orgInfoData.getLibAppId()).getAppTemplate();
                    } else {
                        // normal user, initialize template
                        appTemplate = appProcessor.initializeNewAppTemplate(appInfo);
                    }

                    // Insert new app to database
                    Integer appId = db.insertNewApp(req.getUserId(), appInfo.getAppStatus().getVal(), appInfo, appTemplate);
                    // Initialize app template data to return
                    AppTemplateData appTemplateData = appProcessor.convertToAppTemplateData(appTemplate);
                    // update appInfo with appId
                    appInfo.setAppId(appId);
                    db.updateAppInfo(appId, appInfo);

                    // send email with user instructions
                    emailTemplateProcessor.sendPlaybookCreatedEmail(userInfo.getEmail(), appId, appInfo.getAppName(), appInfo.getAuthor());

                    // Populate return data
                    ret.setAppId(appId);
                    ret.setAppInfo(appInfo);
                    ret.setAppTemplate(appTemplateData);

                    return ret;
                });
    }

    public ResponseWrap<UpdateAppInfoResp> updateAppInfo(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                UpdateAppInfoReq.class,
                ErrorEnum.UpdateAppInfo,
                req -> {
                    // Validate user ID
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    // Validate app ID
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    // Validate app info
                    if (req.getAppInfo() == null) {
                        return "Missing app info.";
                    }
                    return null;
                },
                req -> {
                    UpdateAppInfoResp ret = new UpdateAppInfoResp();

                    // Update app info
                    db.updateAppInfo(req.getAppId(), req.getAppInfo());

                    // Echo back return values
                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    ret.setAppInfo(req.getAppInfo());
                    return ret;
                });
    }

    public ResponseWrap<UpdateAppTemplateResp> updateAppTemplate(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                UpdateAppTemplateReq.class,
                ErrorEnum.UpdateAppTemplate,
                req -> {
                    // Validate user ID
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    // Validate app ID
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    // Validate app template
                    if (req.getAppTemplate() == null) {
                        return "Missing app template.";
                    }
                    if (req.getAppTemplate().getTemplateId() == null) {
                        return "Missing template ID.";
                    }
                    return null;
                },
                req -> {
                    UpdateAppTemplateResp ret = new UpdateAppTemplateResp();

                    // Update app template
                    AppTemplate appTemplate = appProcessor.convertToAppTemplate(req.getAppId(), req.getAppTemplate());
                    db.updateAppTemplate(req.getAppId(), appTemplate);

                    // Echo back return values
                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    ret.setAppTemplate(req.getAppTemplate());
                    return ret;
                });
    }

    public ResponseWrap<StartTestingAppResp> startTestingApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                StartTestingAppReq.class,
                ErrorEnum.StartTestingApp,
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
                    StartTestingAppResp ret = new StartTestingAppResp();

                    // Start testing app
                    // Update app status to TESTING
                    AppStatus status = AppStatus.Testing;
                    db.updateAppStatus(req.getAppId(), status);
                    // Bind the app with user
                    db.addAppToUser(req.getUserId(), req.getAppId());
                    // Get app info
                    AppData appData = db.getAppData(req.getAppId());
                    AppInfo appInfo = appData.getAppInfo();
                    appInfo.setAppStatus(status);
                    db.updateAppInfo(req.getAppId(), appInfo);

                    // Set return data
                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    ret.setAppInfo(appInfo);
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
                    AppStatus status = AppStatus.Published;
                    // Update app status
                    db.updateAppStatus(req.getAppId(), status);
                    // Update/Get app info
                    AppData appData = db.getAppData(req.getAppId());
                    AppInfo appInfo = appData.getAppInfo();
                    appInfo.setAppStatus(status);
                    db.updateAppInfo(req.getAppId(), appInfo);

                    // Set return data
                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    ret.setAppInfo(appInfo);
                    return ret;
                });
    }

    public ResponseWrap<InviteUserToAppResp> inviteUserToApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                InviteUserToAppReq.class,
                ErrorEnum.InviteUserToApp,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    if (req.getEmail() == null) {
                        return "Missing email.";
                    }
                    return null;
                },
                req -> {
                    InviteUserToAppResp ret = new InviteUserToAppResp();

                    // default sender to be info@advicecoach.com
                    String sender = "info@advicecoach.com";
                    // get app info
                    AppData appdata = db.getAppData(req.getAppId());

                    // send invitation to the user
                    invitationProcessor.inviteUserToPlaybook(sender, req.getEmail(), req.getName(), req.getText(), req.getAppId(), appdata.getAppInfo());

                    ret.setUserId(req.getUserId());
                    ret.setIsSuccessful(true);
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

    public ResponseWrap<GetS3SignedUrlResp> getS3SignedUrl(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetS3SignedUrlReq.class,
                ErrorEnum.GetS3SignedUrl,
                req -> {
                    // Validate user ID
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    // Validate s3 data
                    if (req.getBucketName() == null || req.getObjectKey() == null || req.getContentType() == null) {
                        return "Missing s3 data.";
                    }
                    return null;
                },
                req -> {
                    GetS3SignedUrlResp ret = new GetS3SignedUrlResp();

                    // get s3 signed url
                    String s3SignedUrl = awsProcessor.getS3SignedUrl(req.getBucketName(), req.getObjectKey(), req.getContentType());

                    ret.setUserId(req.getUserId());
                    ret.setSignedUrl(s3SignedUrl);
                    return ret;
                });
    }

    public ResponseWrap<RemoveAppUserResp> removeAppUser(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                RemoveAppUserReq.class,
                ErrorEnum.RemoveAppUser,
                req -> {
                    // Validate app ID
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    // Validate app user ID
                    if (req.getAppUserId() == null) {
                        return "Missing app user ID.";
                    }
                    return null;
                },
                req -> {
                    RemoveAppUserResp ret = new RemoveAppUserResp();

                    // remove user from app
                    db.removeAppUser(req.getAppId(), req.getAppUserId());
                    // get all current users on the app
                    List<UserProfile> users = db.getAllUsersOnApp(req.getAppId());

                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    ret.setUsers(users);
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
                    Map<Integer, AppInfo> allUserApps = db.getAllUserApps(req.getUserId());

                    ret.setUserId(req.getUserId());
                    ret.setApps(allUserApps);
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

    public ResponseWrap<SendPushNotificationResp> sendPushNotificationToUser(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                SendPushNotificationReq.class,
                ErrorEnum.SendPushNotification,
                req -> {
                    if (req.getUserId() == null) {
                        return "User ID is required.";
                    }
                    if (req.getAppId() == null) {
                        return "App ID is required.";
                    }
                    if (req.getAppUserId() == null) {
                        return "App user ID is required.";
                    }
                    if (req.getSubject() == null) {
                        return "Notification subject is required.";
                    }
                    return null;
                },
                req -> {
                    SendPushNotificationResp ret = new SendPushNotificationResp();

                    // send notification
                    AppInfo appInfo = db.getAppData(req.getAppId()).getAppInfo();
                    Boolean allowReply;
                    if (req.getAllowReply() == null) allowReply = true;
                    else allowReply = req.getAllowReply();
                    notificationProcessor.sendToUser(req.getUserId(), req.getAppUserId(), appInfo, req.getSubject(), req.getText(), allowReply);

                    ret.setUserId(req.getUserId());
                    ret.setIsSuccessful(true);
                    return ret;
                });
    }

    public ResponseWrap<SendPushNotificationResp> sendPushNotificationToApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                SendPushNotificationReq.class,
                ErrorEnum.SendPushNotification,
                req -> {
                    if (req.getUserId() == null) {
                        return "User ID is required.";
                    }
                    if (req.getAppId() == null) {
                        return "App ID is required.";
                    }
                    if (req.getSubject() == null) {
                        return "Notification subject is required.";
                    }
                    return null;
                },
                req -> {
                    SendPushNotificationResp ret = new SendPushNotificationResp();

                    // get all the users on the app
                    List<UserProfile> allUsersOnApp = db.getAllUsersOnApp(req.getAppId());
                    AppInfo appInfo = db.getAppData(req.getAppId()).getAppInfo();
                    Boolean allowReply;
                    if (req.getAllowReply() == null) allowReply = false;
                    else allowReply = req.getAllowReply();
                    for(UserProfile user : allUsersOnApp) {
                        try {
                            // send notification to each user
                            notificationProcessor.sendToUser(req.getUserId(), user.getUserId(), appInfo, req.getSubject(), req.getText(), allowReply);
                        } catch (NotificationProcessor.NotificationException e) {
                            log.error("Error sending push notification to user [" + user.getUserId() + "]", e);
                        }
                    }

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
                    UserInfo userInfo = db.getUserInfo(req.getUserId());

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

                    UserInfo userInfo = null;
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

    public ResponseWrap<GetOrgInfoDataResp> getOrgInfoData(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetOrgInfoDataReq.class,
                ErrorEnum.GetOrgInfoData,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if (req.getOrgId() == null) {
                        return "Missing organization ID.";
                    }
                    return null;
                },
                req -> {
                    GetOrgInfoDataResp ret = new GetOrgInfoDataResp();

                    // get organization info data
                    OrgInfoData orgInfoData = organizationProcessor.getOrganizationInfoData(req.getUserId(), req.getOrgId());

                    ret.setUserId(req.getUserId());
                    ret.setOrgId(req.getOrgId());
                    ret.setOrgInfoData(orgInfoData);
                    return ret;
                });
    }

    public ResponseWrap<UpdateOrgDataResp> updateOrgData(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                UpdateOrgDataReq.class,
                ErrorEnum.UpdateOrgData,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if (req.getOrgId() == null) {
                        return "Missing organization ID.";
                    }
                    if (req.getOrgData() == null) {
                        return "Missing organization data.";
                    }
                    return null;
                },
                req -> {
                    UpdateOrgDataResp ret = new UpdateOrgDataResp();

                    // update organization data
                    organizationProcessor.updateOrganizationData(req.getUserId(), req.getOrgId(), req.getOrgData());

                    ret.setUserId(req.getUserId());
                    ret.setOrgId(req.getOrgId());
                    ret.setOrgData(req.getOrgData());
                    return ret;
                });
    }

    public ResponseWrap<SubmitSubscriptionResp> submitSubscription(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                SubmitSubscriptionReq.class,
                ErrorEnum.SubmitSubscription,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    if (req.getToken() == null) {
                        return "Missing payment token.";
                    }
                    if (req.getPlanId() == null) {
                        return "Missing plan ID.";
                    }
                    return null;
                },
                req -> {
                    SubmitSubscriptionResp ret = new SubmitSubscriptionResp();

                    // get user email
                    UserInfo userInfo = db.getUserInfo(req.getUserId());
                    // submit Stripe subscription
                    boolean submitSuccessful = true;
                    String message;
                    try {
                        subscriptionProcessor.submitStripeSubscription(req.getUserId(), req.getAppId(), req.getToken(), userInfo.getEmail(), req.getPlanId(), req.getPlanName());
                        message = " Congratulations! Your subscription has been processed!";
                    } catch (SubscriptionProcessor.PaymentException e) {
                        log.error("Error processing subscription payment: " + e.getMessage(), e);
                        submitSuccessful = false;
                        message = "Error: Sorry, we are having trouble processing your subscription. Please contact us at info@advicecoach.com for help!";
                    }

                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    ret.setIsSuccessful(submitSuccessful);
                    ret.setMessage(message);
                    return ret;
                });
    }

    public ResponseWrap<GetSubscriptionDataResp> getSubscriptionData(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetSubscriptionDataReq.class,
                ErrorEnum.GetSubscriptionData,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if (req.getAppId() == null) {
                        return "Missing a ID.";
                    }
                    return null;
                },
                req -> {
                    GetSubscriptionDataResp ret = new GetSubscriptionDataResp();

                    // get subscription data
                    SubData subData = db.getAppSubscriptionData(req.getAppId());
                    subData.setHasSubscription(subData.getSubId() != null && subData.getSubId() > 0);

                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    ret.setSubData(subData);
                    return ret;
                });
    }

    public ResponseWrap<ManageMemberInOrgResp> getAllMembersOfOrganization(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                ManageMemberInOrgReq.class,
                ErrorEnum.ManageMemberInOrg,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if (req.getOrgId() == null) {
                        return "Missing organization ID.";
                    }
                    return null;
                },
                req -> {
                    ManageMemberInOrgResp ret = new ManageMemberInOrgResp();

                    // get all the members of organization
                    List<UserProfile> orgMembers = db.getAllMembersOfOrg(req.getOrgId());

                    ret.setUserId(req.getUserId());
                    ret.setOrgId(req.getOrgId());
                    ret.setMembers(orgMembers);
                    return ret;
                });
    }

    public ResponseWrap<ManageMemberInOrgResp> addMemberToOrganization(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                ManageMemberInOrgReq.class,
                ErrorEnum.ManageMemberInOrg,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if (req.getOrgId() == null) {
                        return "Missing organization ID.";
                    }
                    if (req.getMemberEmail() == null) {
                        return "Missing member email.";
                    }
                    return null;
                },
                req -> {
                    ManageMemberInOrgResp ret = new ManageMemberInOrgResp();

                    // add member to organization
                    String message;
                    List<UserProfile> orgMembers = Lists.newArrayList();
                    try {
                        message = organizationProcessor.addMemberToOrganization(req.getUserId(), req.getOrgId(), req.getMemberEmail(), req.getMemberName());
                        orgMembers = db.getAllMembersOfOrg(req.getOrgId());
                    } catch (OrganizationProcessor.OrganizationException e) {
                        log.error("Error adding member to organization: " + e.getMessage(), e);
                        message = "Error: We are not able to add this member to your organization. Please contact info@advicecoach.com for help!";
                    }

                    ret.setUserId(req.getUserId());
                    ret.setOrgId(req.getOrgId());
                    ret.setMembers(orgMembers);
                    ret.setMessage(message);
                    return ret;
                });
    }

    public ResponseWrap<ManageMemberInOrgResp> removeMemberFromOrganization(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                ManageMemberInOrgReq.class,
                ErrorEnum.ManageMemberInOrg,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if (req.getOrgId() == null) {
                        return "Missing organization ID.";
                    }
                    if (req.getMemberUserId() == null) {
                        return "Missing member user ID.";
                    }
                    return null;
                },
                req -> {
                    ManageMemberInOrgResp ret = new ManageMemberInOrgResp();

                    // remove member from organization
                    String message;
                    List<UserProfile> orgMembers = Lists.newArrayList();
                    try {
                        message = organizationProcessor.removeMemberFromOrganization(req.getUserId(), req.getOrgId(), req.getMemberUserId());
                        orgMembers = db.getAllMembersOfOrg(req.getOrgId());
                    } catch (OrganizationProcessor.OrganizationException e) {
                        message = "Error: We are not able to remove this member from your organization. Please contact info@advicecoach.com for help!";
                    }

                    ret.setUserId(req.getUserId());
                    ret.setOrgId(req.getOrgId());
                    ret.setMembers(orgMembers);
                    ret.setMessage(message);
                    return ret;
                });
    }

    public ResponseWrap<SendEmailResp> sendEmailToAllOrgMembers(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                SendEmailReq.class,
                ErrorEnum.SendEmail,
                req -> {
                    if (req.getUserId() == null) {
                        return "User ID is required.";
                    }
                    if (req.getOrgId() == null) {
                        return "Missing organization ID.";
                    }
                    if (req.getSubject() == null) {
                        return "Email subject is required.";
                    }
                    return null;
                },
                req -> {
                    SendEmailResp ret = new SendEmailResp();

                    // send email
                    organizationProcessor.sendEmailToAllOrgMembers(req.getUserId(), req.getOrgId(), req.getSubject(), req.getText());

                    ret.setUserId(req.getUserId());
                    ret.setIsSuccessful(true);
                    return ret;
                });
    }

    public ResponseWrap<SendEmailResp> emailUserInstructions(RequestWrap<String> requestWrap) {
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
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    return null;
                },
                req -> {
                    SendEmailResp ret = new SendEmailResp();

                    // get app info
                    AppData appData = db.getAppData(req.getAppId());
                    AppInfo appInfo = appData.getAppInfo();
                    // send email
                    emailTemplateProcessor.sendUserInstructionsEmail(req.getRecipient(), req.getSender(), req.getAppId(), appInfo.getAppName(), appInfo.getAuthor(), req.getText());

                    ret.setUserId(req.getUserId());
                    ret.setIsSuccessful(true);
                    return ret;
                });
    }

    public ResponseWrap<CloneAppResp> cloneApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                CloneAppReq.class,
                ErrorEnum.CloneApp,
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
                    CloneAppResp ret = new CloneAppResp();

                    // Clone the app
                    UserInfo userInfo = db.getUserInfo(req.getUserId());
                    // Create new app with the app info
                    AppInfo appInfo = req.getAppInfo();
                    appInfo.setAppStatus(AppStatus.Published);
                    // Get app template of the original app
                    AppTemplate appTemplate = db.getAppData(req.getAppId()).getAppTemplate();
                    // Insert new app to database
                    Integer appId = db.insertNewApp(req.getUserId(), appInfo.getAppStatus().getVal(), appInfo, appTemplate);
                    // update appInfo with appId
                    appInfo.setAppId(appId);
                    db.updateAppInfo(appId, appInfo);

                    // send email with user instructions
                    emailTemplateProcessor.sendPlaybookCreatedEmail(userInfo.getEmail(), appId, appInfo.getAppName(), appInfo.getAuthor());

                    // get all user apps
                    Map<Integer, AppInfo> allUserApps = db.getAllUserApps(req.getUserId());

                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    ret.setApps(allUserApps);
                    return ret;
                });
    }

    public ResponseWrap<AddCustomCategoryToAppTemplateResp> addCustomCategoryToAppTemplate(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                AddCustomCategoryToAppTemplateReq.class,
                ErrorEnum.AddCustomCategoryToAppTemplate,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    if (req.getAppId() == null) {
                        return "Missing app ID.";
                    }
                    if (req.getCategory() == null) {
                        return "Missing category data.";
                    }
                    return null;
                },
                req -> {
                    AddCustomCategoryToAppTemplateResp ret = new AddCustomCategoryToAppTemplateResp();

                    // Add custom category to app template
                    AppData appData = db.getAppData(req.getAppId());
                    AppTemplate appTemplate = appProcessor.addCustomCategoryToAppTemplate(appData.getAppTemplate(), req.getCategory());
                    // save update to db
                    db.updateAppTemplate(req.getAppId(), appTemplate);


                    ret.setUserId(req.getUserId());
                    ret.setAppId(req.getAppId());
                    ret.setAppTemplate(appTemplate);
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
