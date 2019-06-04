package com.advicecoach.common.api.web.error;

public enum ErrorEnum {
    InvalidRequest(1000, "Invalid request."),
    SendEmail(1001, "Error sending user email"),
    SendNotification(1002, "Error sending user notification"),
    GetUserNotifications(1003, "Error getting user notifications"),
    SetUserNotificationAsRead(1004, "Error setting user notifications as read"),
    RemoveNotification(1005, "Error removing notification")
    ;


    private ErrorInfo error;

    ErrorEnum(long code, String summary) {
        this.error = new ErrorInfo(code).setSummary(summary);
    }

    public ErrorInfo getError() {
        return error.newInstance();
    }
}
