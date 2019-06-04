package com.advicecoach.services.communication.impl;

import com.advicecoach.common.api.web.comm.RequestWrap;
import com.advicecoach.common.api.web.comm.ResponseWrap;
import com.advicecoach.common.api.web.error.ErrorEnum;
import com.advicecoach.common.api.web.msg.*;
import com.advicecoach.common.datamodel.user.UserProfile;
import com.advicecoach.common.datamodel.user.notifications.UserNotification;
import com.advicecoach.common.datamodel.user.notifications.UserNotifications;
import com.advicecoach.common.util.mysql.MySqlDataConnector;
import com.advicecoach.services.communication.impl.data.DatabaseAccess;
import com.advicecoach.services.communication.impl.modules.ErrorEmailSender;
import com.advicecoach.services.communication.impl.modules.NotificationProcessor;
import com.advicecoach.services.communication.impl.modules.UserEmailSender;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.queue.CircularFifoQueue;

import java.util.List;

@Slf4j
public class CommunicationServiceImpl {
    private final DatabaseAccess db;
    private final Gson gson;

    private final ErrorEmailSender errorEmailSender;
    private final UserEmailSender userEmailSender;
    private final NotificationProcessor notificationProcessor;

    @Inject
    public CommunicationServiceImpl(final DatabaseAccess db,
                                    final ErrorEmailSender errorEmailSender,
                                    final UserEmailSender userEmailSender,
                                    final NotificationProcessor notificationProcessor) throws Exception {
        this.gson = new GsonBuilder().create();

        this.db = db;
        this.errorEmailSender = errorEmailSender;
        this.userEmailSender = userEmailSender;
        this.notificationProcessor = notificationProcessor.setDb(this.db);
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

    public ResponseWrap<SendNotificationResp> sendNotificationToUser(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                SendNotificationReq.class,
                ErrorEnum.SendNotification,
                req -> {
                    if (req.getUserId() == null) {
                        return "User ID is required.";
                    }
                    if (req.getRecipientUserId() == null) {
                        return "Recipient user ID is required.";
                    }
                    if (req.getSubject() == null) {
                        return "Notification subject is required.";
                    }
                    return null;
                },
                req -> {
                    SendNotificationResp ret = new SendNotificationResp();

                    // send notification
                    notificationProcessor.sendToUser(req.getUserId(), req.getRecipientUserId(), req.getSender(), req.getSubject(), req.getText(), req.isAllowReply(), req.getImageUrl(), req.getVideoUrl());

                    ret.setUserId(req.getUserId());
                    ret.setIsSuccessful(true);
                    return ret;
                });
    }

    public ResponseWrap<SendNotificationResp> sendNotificationToApp(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                SendNotificationReq.class,
                ErrorEnum.SendNotification,
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
                    SendNotificationResp ret = new SendNotificationResp();

                    // get all the users on the app
                    List<UserProfile> allUsersOnApp = db.getAllUsersOnApp(req.getAppId());
                    for(UserProfile user : allUsersOnApp) {
                        try {
                            // send notification to each user
                            notificationProcessor.sendToUser(req.getUserId(), user.getUserId(), req.getSender(), req.getSubject(), req.getText(), req.isAllowReply(), req.getImageUrl(), req.getVideoUrl());
                        } catch (NotificationProcessor.NotificationException e) {
                            log.error("Error sending push notification to user [" + user.getUserId() + "]", e);
                        }
                    }

                    ret.setUserId(req.getUserId());
                    ret.setIsSuccessful(true);
                    return ret;
                });
    }

    public ResponseWrap<RemoveNotificationResp> removeNotification(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                RemoveNotificationReq.class,
                ErrorEnum.RemoveNotification,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing User ID";
                    }
                    if (req.getNotificationId() == null) {
                        return "Missing Notification ID";
                    }
                    return null;
                },
                req -> {
                    RemoveNotificationResp ret = new RemoveNotificationResp();

                    // remove notification
                    UserNotifications userNotifications;
                    try {
                        userNotifications = db.getUserNotifications(req.getUserId());
                        // remove element by id
                        boolean success = userNotifications.getNotifications().removeIf((UserNotification notification) -> notification.getId().equals(req.getNotificationId()));

                        if(!success) {
                            ret.setSuccess(false);
                            return ret;
                        }

                        db.updateUserNotifications(req.getUserId(), userNotifications);

                        ret.setSuccess(true);
                        ret.setUserId(req.getUserId());
                        ret.setNotificationId(req.getNotificationId());
                        return ret;
                    } catch (MySqlDataConnector.DataNotFoundException e) {
                        ret.setSuccess(false);
                        return ret;
                    }
                });
    }

    public ResponseWrap<SetUserNotificationAsReadResp> setUserNotificationAsRead(RequestWrap<String> requestWrap) {
        return process(requestWrap,
                SetUserNotificationAsReadReq.class,
                ErrorEnum.SetUserNotificationAsRead,
                req -> {
                    if (req.getUserId() == null) {
                        return "Missing User ID";
                    }
                    if (req.getNotificationId() == null) {
                        return "Missing Notification ID";
                    }
                    return null;
                },
                req -> {
                    SetUserNotificationAsReadResp ret = new SetUserNotificationAsReadResp();

                    // set user notification as read
                    UserNotifications userNotifications;
                    try {
                        userNotifications = db.getUserNotifications(req.getUserId());
                        Integer notificationIndex = notificationProcessor.findNotificationIndexById(userNotifications.getNotifications(), req.getNotificationId());

                        if (notificationIndex == -1){
                            // no matching notification
                            ret.setSuccess(false);
                            return ret;
                        }
                        userNotifications.getNotifications().get(notificationIndex).setHasRead(true);
                        db.updateUserNotifications(req.getUserId(), userNotifications);

                        ret.setSuccess(true);
                        ret.setUserId(req.getUserId());
                        ret.setNotificationId(req.getNotificationId());
                        return ret;
                    } catch (MySqlDataConnector.DataNotFoundException e) {
                        ret.setSuccess(false);
                        return ret;
                    }
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
    public interface Function<T, R> {
        R apply(T t) throws Exception;
    }
}
