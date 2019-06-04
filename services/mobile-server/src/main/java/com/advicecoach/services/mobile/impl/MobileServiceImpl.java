package com.advicecoach.services.mobile.impl;

import com.advicecoach.common.api.mobile.comm.RequestWrap;
import com.advicecoach.common.api.mobile.comm.ResponseWrap;
import com.advicecoach.common.api.mobile.data.UserApp;
import com.advicecoach.common.api.mobile.error.ErrorEnum;
import com.advicecoach.common.api.mobile.msg.*;
import com.advicecoach.common.datamodel.app.AppData;
import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.common.datamodel.app.AppType;
import com.advicecoach.common.datamodel.custom.CustomApp;
import com.advicecoach.common.datamodel.user.UserProfile;
import com.advicecoach.common.datamodel.user.notes.UserNotes;
import com.advicecoach.common.datamodel.user.notifications.UserNotifications;
import com.advicecoach.common.util.mysql.MySqlDataConnector;
import com.advicecoach.services.mobile.impl.data.DatabaseAccess;
import com.advicecoach.services.mobile.impl.data.Points;
import com.advicecoach.services.mobile.impl.modules.*;
import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * Created by nan on 10/1/2016.
 */
@Slf4j
public class MobileServiceImpl {
    private final DatabaseAccess db;
    private final Gson gson;

    private final AppsProcessor appsProcessor;
    private final CustomAppProcessor customAppProcessor;
    private final LoginProcessor loginProcessor;
    private final ErrorEmailSender errorEmailSender;
    private final AnalysisProcessor analysisProcessor;
    private final UserNotesProcessor userNotesProcessor;
    private final UserProcessor userProcessor;

    @Inject
    public MobileServiceImpl(final DatabaseAccess db,
                             final AppsProcessor appsProcessor,
                             final CustomAppProcessor customAppProcessor,
                             final LoginProcessor loginProcessor,
                             final UserProcessor userProcessor,
                             final UserNotesProcessor userNotesProcessor,
                             final ErrorEmailSender errorEmailSender,
                             final AnalysisProcessor analysisProcessor) {
        this.gson = new GsonBuilder().create();

        this.db = db;
        this.appsProcessor = appsProcessor.setDb(this.db);
        this.customAppProcessor = customAppProcessor;
        this.analysisProcessor = analysisProcessor;
        this.loginProcessor = loginProcessor.setDb(this.db);
        this.userProcessor = userProcessor.setDb(this.db);
        this.userNotesProcessor = userNotesProcessor;
        this.errorEmailSender = errorEmailSender;
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
                    UserLoginResp ret = new UserLoginResp();

                    // process user login
                    LoginProcessor.LoginData loginData = loginProcessor.processUserLogin(req.getUserInfo());

                    // for new user
                    //if (loginData.isNewUser()) {
                        //userProcessor.setupNewUser(loginData.getUserId());
                    //}

                    ret.setUserId(loginData.getUserId());
                    ret.setUserInfo(req.getUserInfo());
                    ret.setNewUser(loginData.isNewUser());
                    return ret;
                });
    }

    public ResponseWrap<GetAppResp> getAppInfo(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetAppReq.class,
                ErrorEnum.GetApp,
                req -> {
                    if (req.getAppId() == null) {
                        return "App ID is required";
                    }
                    return null;
                },
                req -> {
                    GetAppResp ret = new GetAppResp();

                    // get app info
                    AppInfo app = null;
                    if(req.getAppId() > 0) {
                        app = appsProcessor.getApp(req.getAppId());
                    }

                    ret.setAppId(req.getAppId());
                    ret.setAppInfo(app);
                    return ret;
                });
    }

    public ResponseWrap<GetAppResp> getPublishedApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetAppReq.class,
                ErrorEnum.GetApp,
                req -> {
                    if (req.getAppId() == null) {
                        return "App ID is required";
                    }
                    return null;
                },
                req -> {
                    GetAppResp ret = new GetAppResp();

                    // get app info
                    AppInfo app = null;
                    if(req.getAppId() > 0) {
                        app = appsProcessor.getPublishedApp(req.getAppId());
                    }

                    ret.setAppId(req.getAppId());
                    ret.setAppInfo(app);
                    return ret;
                });
    }

    public ResponseWrap<GetAllAvailableAppsResp> getAllAvailableApps(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetAllAvailableAppsReq.class,
                ErrorEnum.GetAllAvailableApps,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing user ID.";
                    }
                    return null;
                },
                req -> {
                    GetAllAvailableAppsResp ret = new GetAllAvailableAppsResp();

                    // get all public apps
                    List<AppInfo> apps = appsProcessor.getAllPublicApps(req.getUserId());

                    ret.setApps(apps);
                    return ret;
                });
    }

    public ResponseWrap<AddAppToUserResp> addAppToUser(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                AddAppToUserReq.class,
                ErrorEnum.AddAppToUser,
                req -> {
                    if (req.getUserId() == null || req.getUserId() < 1) {
                        return "User ID is required";
                    }
                    if (req.getAppId() == null || req.getAppId() < 1) {
                        return "App ID is required";
                    }
                    return null;
                },
                req -> {
                    AddAppToUserResp ret = new AddAppToUserResp();

                    // add app to user
                    db.addAppToUser(req.getUserId(), req.getAppId());
                    // get all user apps
                    List<UserApp> userApps = appsProcessor.getUserApps(req.getUserId());

                    ret.setUserApps(userApps);
                    return ret;
                });
    }

    public ResponseWrap<RemoveAppFromUserResp> removeAppFromUser(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                RemoveAppFromUserReq.class,
                ErrorEnum.RemoveAppFromUser,
                req -> {
                    if (req.getUserId() == null || req.getUserId() < 1) {
                        return "User ID is required";
                    }
                    if (req.getAppId() == null || req.getAppId() < 1) {
                        return "App ID is required";
                    }
                    if (req.getCustomAppId() == null) {
                        return "Missing custom app ID";
                    }
                    return null;
                },
                req -> {
                    RemoveAppFromUserResp ret = new RemoveAppFromUserResp();

                    // remove app from user
                    db.removeAppFromUser(req.getUserId(), req.getAppId());
                    // if custom app exists, remove it as well
                    if(req.getCustomAppId() > 0) {
                        db.removeCustomApp(req.getUserId(), req.getCustomAppId());
                    }
                    // get all user apps
                    List<UserApp> userApps = appsProcessor.getUserApps(req.getUserId());

                    ret.setUserApps(userApps);
                    return ret;
                });
    }


    public ResponseWrap<GetUserAppsResp> getUserApps(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetUserAppsReq.class,
                ErrorEnum.GetUserApps,
                req -> null,
                req -> {
                    GetUserAppsResp ret = new GetUserAppsResp();

                    // get all user apps
                    List<UserApp> userApps = appsProcessor.getUserApps(req.getUserId());

                    ret.setUserApps(userApps);
                    return ret;
                });
    }

    public ResponseWrap<GetCustomAppResp> getCustomApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetCustomAppReq.class,
                ErrorEnum.GetCustomApp,
                req -> null,
                req -> {
                    GetCustomAppResp ret = new GetCustomAppResp();

                    // get custom app
                    Integer customAppId = req.getCustomAppId();
                    CustomApp customApp = null;
                    if (req.getCustomAppId() != null) {
                        customApp = db.getCustomAppById(req.getCustomAppId());
                    }
                    if(req.getAppId() != null && req.getUserId() != null) {
                        try {
                            customApp = db.getCustomAppByUserAndAppId(req.getUserId(), req.getAppId());
                        } catch (MySqlDataConnector.DataNotFoundException e) {
                            // create new custom app
                            AppData appData = db.getAppData(req.getAppId());
                            customApp = customAppProcessor.createNewCustomApp(req.getUserId(), appData);
                            // save the new custom app to database and get generated custom app ID
                            customAppId = db.createNewCustomApp(req.getUserId(), req.getAppId(), customApp);
                            customApp.setCustomAppId(customAppId);
                        }
                    }

                    ret.setCustomAppId(customAppId);
                    ret.setCustomApp(customApp);
                    return ret;
                });
    }

    public ResponseWrap<GetAppTemplateResp> getAppTemplate(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetAppTemplateReq.class,
                ErrorEnum.GetAppTemplate,
                req -> {
                    if (req.getAppId() == null || req.getAppId() < 1) {
                        return "App ID is invalid: " + req.getAppId();
                    }
                    return null;
                },
                req -> {
                    GetAppTemplateResp ret = new GetAppTemplateResp();

                    // get app template
                    AppTemplate template = db.getAppTemplate(req.getAppId());

                    ret.setAppTemplate(template);
                    return ret;
                });
    }

    public ResponseWrap<CreateNewCustomAppResp> createNewCustomApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                CreateNewCustomAppReq.class,
                ErrorEnum.CreateNewCustomApp,
                req -> {
                    if (req.getUserId() == null || req.getAppId() == null) {
                        return "Both user ID and app ID are required to create new custom app";
                    }
                    return null;
                },
                req -> {
                    CreateNewCustomAppResp ret = new CreateNewCustomAppResp();

                    CustomApp customApp;

                    // double check if it is a new custom app, or a custom app already exists
                    try{
                        // already existed
                        customApp = db.getCustomAppByUserAndAppId(req.getUserId(), req.getAppId());
                    } catch (MySqlDataConnector.DataNotFoundException e) {
                        // does not exist
                        // Create new custom app
                        AppData appData = db.getAppData(req.getAppId());

                        // create new custom app
                        customApp = customAppProcessor.createNewCustomApp(req.getUserId(), appData);

                        // save the new custom app to database and get generated custom app ID
                        Integer customAppId = db.createNewCustomApp(req.getUserId(), req.getAppId(), customApp);
                        customApp.setCustomAppId(customAppId);

                        // analysis track
                        analysisProcessor.trackCreateNewCustomApp(req.getUserId(), req.getAppId());
                    }

                    ret.setAppId(req.getAppId());
                    ret.setAppId(req.getAppId());
                    ret.setCustomAppId(customApp.getCustomAppId());
                    ret.setCustomApp(customApp);
                    return ret;
                });
    }

    public ResponseWrap<CreateNewCustomAppResp> createNewCustomAppLibraryOnly(RequestWrap<String> requestWrap) {
        // legacy entrance (merged into createNewCustomApp)
        return this.createNewCustomApp(requestWrap);
    }

    public ResponseWrap<SyncCustomAppResp> syncCustomApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                SyncCustomAppReq.class,
                ErrorEnum.SyncCustomApp,
                req -> {
                    if (req.getCustomAppId() == null) {
                        return "Missing custom app ID";
                    }
                    return null;
                },
                req -> {
                    SyncCustomAppResp ret = new SyncCustomAppResp();

                    // Compare custom app and app template, and update custom app with any new information
                    CustomApp currentCustomApp = db.getCustomAppById(req.getCustomAppId());
                    Integer appId = currentCustomApp.getAppId();
                    AppData appData = db.getAppData(appId);
                    CustomApp updatedCustomApp = customAppProcessor.syncCustomApp(currentCustomApp, appData);

                    // save updated custom app to database
                    db.updateCustomApp(req.getCustomAppId(), updatedCustomApp);

                    ret.setUserId(req.getUserId());
                    ret.setCustomAppId(req.getCustomAppId());
                    ret.setCustomApp(updatedCustomApp);
                    ret.setAppId(appId);
                    ret.setAppTemplate(appData.getAppTemplate());
                    return ret;
                });
    }

    public ResponseWrap<AddCategoriesToCustomAppResp> addCategoriesToCustomApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                AddCategoriesToCustomAppReq.class,
                ErrorEnum.AddCategoriesToCustomApp,
                req -> {
                    if (req.getCustomAppId() == null) {
                        return "Missing custom app ID";
                    }
                    if (req.getCategoryIDs() == null || req.getCategoryIDs().isEmpty()) {
                        return "Category ID list cannot be empty";
                    }
                    return null;
                },
                req -> {
                    AddCategoriesToCustomAppResp ret = new AddCategoriesToCustomAppResp();

                    // Add categories to existing custom app
                    CustomApp currentCustomApp = db.getCustomAppById(req.getCustomAppId());
                    AppTemplate appTemplate = db.getAppTemplate(currentCustomApp.getAppId());
                    CustomApp updatedCustomApp = customAppProcessor.addCategoriesToCustomApp(currentCustomApp, req.getCategoryIDs(), appTemplate);

                    // save updated custom app to database
                    db.updateCustomApp(req.getCustomAppId(), updatedCustomApp);

                    ret.setCustomAppId(req.getCustomAppId());
                    ret.setCustomApp(updatedCustomApp);
                    return ret;
                });
    }

    public ResponseWrap<AddUserCategoryToCustomAppResp> addUserCategoryToCustomApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                AddUserCategoryToCustomAppReq.class,
                ErrorEnum.AddUserCategoryToCustomApp,
                req -> {
                    if (req.getCustomAppId() == null) {
                        return "Custom app ID is required";
                    }
                    if (req.getNewCategory() == null) {
                        return "Missing user category data";
                    }
                    return null;
                },
                req -> {
                    AddUserCategoryToCustomAppResp ret = new AddUserCategoryToCustomAppResp();

                    CustomApp currentCustomApp = db.getCustomAppById(req.getCustomAppId());
                    // add new user category to custom app
                    CustomApp updatedCustomApp = customAppProcessor.addUserCategory(currentCustomApp, req.getNewCategory());
                    // save updated custom app
                    db.updateCustomApp(req.getCustomAppId(), updatedCustomApp);

                    ret.setCustomAppId(req.getCustomAppId());
                    ret.setCustomApp(updatedCustomApp);
                    return ret;
                });
    }

    public ResponseWrap<UpdateCustomAppCategoryResp> updateCustomAppCategory(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                UpdateCustomAppCategoryReq.class,
                ErrorEnum.UpdateCustomAppCategory,
                req -> {
                    if (req.getCustomAppId() == null) {
                        return "Missing custom app ID";
                    }
                    if (req.getCategoryId() == null) {
                        return "Missing category ID";
                    }
                    if (req.getCategory() == null) {
                        return "Missing category data";
                    }
                    return null;
                },
                req -> {
                    UpdateCustomAppCategoryResp ret = new UpdateCustomAppCategoryResp();

                    CustomApp currentCustomApp = db.getCustomAppById(req.getCustomAppId());
                    CustomApp updatedCustomApp = customAppProcessor.editCategory(currentCustomApp, req.getCategoryId(), req.getCategory());;
                    // save updated custom app
                    db.updateCustomApp(req.getCustomAppId(), updatedCustomApp);

                    ret.setCustomAppId(req.getCustomAppId());
                    ret.setCustomApp(updatedCustomApp);
                    return ret;
                });
    }

    public ResponseWrap<RemoveCategoriesFromCustomAppResp> removeCategoriesFromCustomApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                RemoveCategoriesFromCustomAppReq.class,
                ErrorEnum.RemoveCategoriesFromCustomApp,
                req -> {
                    if (req.getCustomAppId() == null) {
                        return "Missing custom app ID";
                    }
                    if (req.getCategoryIDs() == null || req.getCategoryIDs().isEmpty()) {
                        return "Category ID list cannot be empty";
                    }
                    return null;
                },
                req -> {
                    RemoveCategoriesFromCustomAppResp ret = new RemoveCategoriesFromCustomAppResp();

                    // remove the specified categories
                    CustomApp currentCustomApp = db.getCustomAppById(req.getCustomAppId());
                    CustomApp updatedCustomApp = customAppProcessor.removeCategoriesFromCustomApp(currentCustomApp, req.getCategoryIDs());

                    // save updated custom app to database
                    db.updateCustomApp(req.getCustomAppId(), updatedCustomApp);

                    ret.setCustomAppId(req.getCustomAppId());
                    ret.setCustomApp(updatedCustomApp);
                    return ret;
                });
    }

    public ResponseWrap<ReorderCustomAppCategoriesResp> reorderCustomAppCategories(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                ReorderCustomAppCategoriesReq.class,
                ErrorEnum.ReorderCustomAppCategories,
                req -> {
                    if (req.getCustomAppId() == null) {
                        return "Missing custom app ID";
                    }
                    if (req.getCategoryIDs() == null || req.getCategoryIDs().isEmpty()) {
                        return "Category ID list cannot be empty";
                    }
                    return null;
                },
                req -> {
                    ReorderCustomAppCategoriesResp ret = new ReorderCustomAppCategoriesResp();

                    // re-arrange the categories according to the order in the request
                    CustomApp currentCustomApp = db.getCustomAppById(req.getCustomAppId());
                    CustomApp updatedCustomApp = customAppProcessor.reorderCategoriesInCustomApp(currentCustomApp, req.getCategoryIDs());

                    // save updated custom app
                    db.updateCustomApp(req.getCustomAppId(), updatedCustomApp);

                    ret.setCustomAppId(req.getCustomAppId());
                    ret.setCustomApp(updatedCustomApp);
                    return ret;
                });
    }

    public ResponseWrap<UpdateCustomAppReminderResp> updateCustomAppReminder(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                UpdateCustomAppReminderReq.class,
                ErrorEnum.UpdateCustomAppReminder,
                req -> {
                    if (req.getCustomAppId() == null) {
                        return "Missing custom app ID";
                    }
                    if (req.getReminder() == null || req.getReminder().getReminderId() == null) {
                        return "Missing reminder data";
                    }
                    return null;
                },
                req -> {
                    UpdateCustomAppReminderResp ret = new UpdateCustomAppReminderResp();

                    // update reminder on custom app
                    CustomApp customApp = db.getCustomAppById(req.getCustomAppId());
                    customApp.setReminder(req.getReminder());
                    // add points
                    customApp.setPoints(customApp.getPoints() + Points.SetReminder.getPoints());
                    // save updated custom app
                    db.updateCustomApp(req.getCustomAppId(), customApp);

                    ret.setCustomApp(customApp);
                    return ret;
                });
    }

    public ResponseWrap<RemoveCustomAppReminderResp> removeCustomAppReminder(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                RemoveCustomAppReminderReq.class,
                ErrorEnum.RemoveCustomAppReminder,
                req -> {
                    if (req.getCustomAppId() == null) {
                        return "Custom app ID is required";
                    }
                    return null;
                },
                req -> {
                    RemoveCustomAppReminderResp ret = new RemoveCustomAppReminderResp();

                    // remove reminder from custom app
                    CustomApp customApp = db.getCustomAppById(req.getCustomAppId());
                    customApp.setReminder(null);
                    // save updated custom app
                    db.updateCustomApp(req.getCustomAppId(), customApp);

                    ret.setCustomApp(customApp);
                    return ret;
                });
    }

    public ResponseWrap<SubmitCustomCategoryActionResp> submitCustomCategoryAction(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                SubmitCustomCategoryActionReq.class,
                ErrorEnum.SubmitCustomCategoryAction,
                req -> {
                    if (req.getCustomAppId() == null) {
                        return "Custom app ID is required";
                    }
                    if (req.getCategoryId() == null || req.getCategoryId().isEmpty()) {
                        return "Missing category ID";
                    }
                    if (req.getActionType() == null) {
                        return "Missing action type";
                    }
                    return null;
                },
                req -> {
                    SubmitCustomCategoryActionResp ret = new SubmitCustomCategoryActionResp();

                    CustomApp currentCustomApp = db.getCustomAppById(req.getCustomAppId());
                    // process custom category action
                    CustomApp updatedCustomApp = customAppProcessor.customCategoryAction(currentCustomApp, req.getActionType(), req.getActionData());
                    // save updated custom app to database
                    db.updateCustomApp(req.getCustomAppId(), updatedCustomApp);

                    // analysis track
                    analysisProcessor.trackActiveCategory(currentCustomApp.getUserId(), currentCustomApp.getAppId(), req.getCategoryId());

                    ret.setCustomApp(updatedCustomApp);
                    return ret;
                });
    }

    public ResponseWrap<GetUserProfileResp> getUserProfile(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetUserProfileReq.class,
                ErrorEnum.GetUserProfile,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing User ID";
                    }
                    return null;
                },
                req -> {
                    GetUserProfileResp ret = new GetUserProfileResp();

                    // get user profile
                    UserProfile profile = new UserProfile();
                    profile.setUserId(req.getUserId());
                    profile.setUserInfo(db.getUserInfo(req.getUserId()));

                    ret.setUserProfile(profile);
                    return ret;
                });
    }

    public ResponseWrap<GetUserNotesResp> getUserNotes(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetUserNotesReq.class,
                ErrorEnum.GetUserNotes,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing User ID";
                    }
                    return null;
                },
                req -> {
                    GetUserNotesResp ret = new GetUserNotesResp();

                    // get all user notes
                    UserNotes userNotes;
                    try {
                        userNotes = db.getUserNotes(req.getUserId());
                    } catch (MySqlDataConnector.DataNotFoundException e) {
                        userNotes = new UserNotes();
                    }

                    ret.setNotes(userNotes.getNotes().values());
                    return ret;
                });
    }

    public ResponseWrap<AddUserNoteResp> addUserNote(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                AddUserNoteReq.class,
                ErrorEnum.AddUserNote,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing User ID";
                    }
                    if (req.getNote() == null) {
                        return "Missing user note";
                    }
                    return null;
                },
                req -> {
                    AddUserNoteResp ret = new AddUserNoteResp();

                    // add note to user notes
                    UserNotes currentUserNotes;
                    try{
                        currentUserNotes = db.getUserNotes(req.getUserId());
                    } catch (MySqlDataConnector.DataNotFoundException e) {
                        currentUserNotes = new UserNotes();
                        db.initializeUserNotes(req.getUserId(), currentUserNotes);
                    }
                    UserNotes updatedUserNotes = userNotesProcessor.addNote(currentUserNotes, req.getNote());
                    // save update to db
                    db.updateUserNotes(req.getUserId(), updatedUserNotes);

                    ret.setNotes(updatedUserNotes.getNotes().values());
                    return ret;
                });
    }

    public ResponseWrap<RemoveUserNoteResp> removeUserNote(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                RemoveUserNoteReq.class,
                ErrorEnum.RemoveUserNote,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing User ID";
                    }
                    if (req.getNoteId() == null) {
                        return "Missing note ID";
                    }
                    return null;
                },
                req -> {
                    RemoveUserNoteResp ret = new RemoveUserNoteResp();

                    // remove note from user notes
                    UserNotes currentUserNotes = db.getUserNotes(req.getUserId());
                    UserNotes updatedUserNotes = userNotesProcessor.removeNote(currentUserNotes, req.getNoteId());
                    // save update to db
                    db.updateUserNotes(req.getUserId(), updatedUserNotes);

                    ret.setNotes(updatedUserNotes.getNotes().values());
                    return ret;
                });
    }

    public ResponseWrap<UpdateUserNoteResp> updateUserNote(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                UpdateUserNoteReq.class,
                ErrorEnum.UpdateUserNote,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing User ID";
                    }
                    if (req.getNoteId() == null) {
                        return "Missing note ID";
                    }
                    if (req.getNote() == null) {
                        return "Missing user note";
                    }
                    return null;
                },
                req -> {
                    UpdateUserNoteResp ret = new UpdateUserNoteResp();

                    // update existing user note
                    UserNotes currentUserNotes = db.getUserNotes(req.getUserId());
                    UserNotes updatedUserNotes = userNotesProcessor.updateNote(currentUserNotes, req.getNoteId(), req.getNote());
                    // save update to db
                    db.updateUserNotes(req.getUserId(), updatedUserNotes);

                    ret.setNotes(updatedUserNotes.getNotes().values());
                    return ret;
                });
    }

    public ResponseWrap<GetUserNotificationsResp> getUserNotifications(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                GetUserNotificationsReq.class,
                ErrorEnum.GetUserNotifications,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing User ID";
                    }
                    return null;
                },
                req -> {
                    GetUserNotificationsResp ret = new GetUserNotificationsResp();

                    // get all user notifications
                    UserNotifications userNotifications;
                    try {
                        userNotifications = db.getUserNotifications(req.getUserId());
                    } catch (MySqlDataConnector.DataNotFoundException e) {
                        userNotifications = new UserNotifications();
                    }

                    ret.setNotifications(userNotifications.getNotifications());
                    return ret;
                });
    }

    public ResponseWrap<AddCategoryFeedbackResp> addCategoryFeedback(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                AddCategoryFeedbackReq.class,
                ErrorEnum.AddCategoryFeedback,
                req -> {
                    if (req.getCustomAppId() == null) {
                        return "Missing custom app ID";
                    }
                    if (req.getCategoryId() == null) {
                        return "Missing category ID";
                    }
                    if (req.getFeedback() == null) {
                        return "Missing feedback";
                    }
                    return null;
                },
                req -> {
                    AddCategoryFeedbackResp ret = new AddCategoryFeedbackResp();

                    CustomApp currentCustomApp = db.getCustomAppById(req.getCustomAppId());
                    CustomApp updatedCustomApp = customAppProcessor.addFeedback(currentCustomApp, req.getCategoryId(), req.getFeedback());
                    // save updated custom app
                    db.updateCustomApp(req.getCustomAppId(), updatedCustomApp);

                    ret.setCustomAppId(req.getCustomAppId());
                    ret.setCustomApp(updatedCustomApp);
                    return ret;
                });
    }

    public ResponseWrap<AddCustomAppGoalResp> addCustomAppGoal(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                AddCustomAppGoalReq.class,
                ErrorEnum.AddCustomAppGoal,
                req -> {
                    if (req.getCustomAppId() == null) {
                        return "Missing custom app ID";
                    }
                    if (req.getGoal() == null) {
                        return "Missing goal content";
                    }
                    return null;
                },
                req -> {
                    AddCustomAppGoalResp ret = new AddCustomAppGoalResp();

                    CustomApp currentCustomApp = db.getCustomAppById(req.getCustomAppId());
                    CustomApp updatedCustomApp = customAppProcessor.addGoal(currentCustomApp, req.getGoal(), req.getEndTime());
                    // save updated custom app
                    db.updateCustomApp(req.getCustomAppId(), updatedCustomApp);

                    ret.setCustomAppId(req.getCustomAppId());
                    ret.setCustomApp(updatedCustomApp);
                    return ret;
                });
    }

    public ResponseWrap<UpdateCustomAppGoalResp> updateCustomAppGoal(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                UpdateCustomAppGoalReq.class,
                ErrorEnum.UpdateCustomAppGoal,
                req -> {
                    if (req.getCustomAppId() == null) {
                        return "Missing custom app ID";
                    }
                    if (req.getGoalId() == null) {
                        return "Missing goal ID";
                    }
                    if (req.getGoal() == null) {
                        return "Missing goal content";
                    }
                    return null;
                },
                req -> {
                    UpdateCustomAppGoalResp ret = new UpdateCustomAppGoalResp();

                    CustomApp currentCustomApp = db.getCustomAppById(req.getCustomAppId());
                    CustomApp updatedCustomApp = customAppProcessor.updateGoal(currentCustomApp, req.getGoalId(), req.getGoal(), req.getEndTime());
                    // save updated custom app
                    db.updateCustomApp(req.getCustomAppId(), updatedCustomApp);

                    ret.setCustomAppId(req.getCustomAppId());
                    ret.setCustomApp(updatedCustomApp);
                    return ret;
                });
    }

    public ResponseWrap<RemoveCustomAppGoalResp> removeCustomAppGoal(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                RemoveCustomAppGoalReq.class,
                ErrorEnum.RemoveCustomAppGoal,
                req -> {
                    if (req.getCustomAppId() == null) {
                        return "Missing custom app ID";
                    }
                    if (req.getGoalId() == null) {
                        return "Missing goal ID";
                    }
                    return null;
                },
                req -> {
                    RemoveCustomAppGoalResp ret = new RemoveCustomAppGoalResp();

                    CustomApp currentCustomApp = db.getCustomAppById(req.getCustomAppId());
                    CustomApp updatedCustomApp = customAppProcessor.removeGoal(currentCustomApp, req.getGoalId());
                    // save updated custom app
                    db.updateCustomApp(req.getCustomAppId(), updatedCustomApp);

                    ret.setCustomAppId(req.getCustomAppId());
                    ret.setCustomApp(updatedCustomApp);
                    return ret;
                });
    }

    public ResponseWrap<AddCustomAppGoalProgressResp> addCustomAppGoalProgress(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                AddCustomAppGoalProgressReq.class,
                ErrorEnum.AddCustomAppGoalProgress,
                req -> {
                    if (req.getCustomAppId() == null) {
                        return "Missing custom app ID";
                    }
                    if (req.getGoalId() == null) {
                        return "Missing goal ID";
                    }
                    if (req.getProgress() == null) {
                        return "Missing progress content";
                    }
                    return null;
                },
                req -> {
                    AddCustomAppGoalProgressResp ret = new AddCustomAppGoalProgressResp();

                    CustomApp currentCustomApp = db.getCustomAppById(req.getCustomAppId());
                    CustomApp updatedCustomApp = customAppProcessor.addGoalProgress(currentCustomApp, req.getGoalId(), req.getProgress());
                    // save updated custom app
                    db.updateCustomApp(req.getCustomAppId(), updatedCustomApp);

                    ret.setCustomAppId(req.getCustomAppId());
                    ret.setCustomApp(updatedCustomApp);
                    return ret;
                });
    }

    public ResponseWrap<UpdateAppTemplateResp> updateAppTemplate(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                UpdateAppTemplateReq.class,
                ErrorEnum.UpdateAppTemplate,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing User ID";
                    }
                    if (req.getAppId() == null || req.getAppId() < 1) {
                        return "Invalid App ID: " + req.getAppId();
                    }
                    if (req.getAppTemplate() == null) {
                        return "Missing App Template";
                    }
                    return null;
                },
                req -> {
                    UpdateAppTemplateResp ret = new UpdateAppTemplateResp();

                    // get app template
                    AppData appData = db.getAppData(req.getAppId());
                    AppTemplate appTemplate = appData.getAppTemplate();
                    log.debug("req user id: {}, owner user id: {}", req.getUserId(), appData.getAppInfo().getOwnerUserId());
                    if(req.getUserId().equals(appData.getAppInfo().getOwnerUserId())) {
                        // app owner is updating the template, allow
                        db.updateAppTemplate(req.getAppId(), req.getAppTemplate());
                        appTemplate = req.getAppTemplate();
                    }

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
