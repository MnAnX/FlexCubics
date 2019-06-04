package com.advicecoach.common.api.report.error;

/**
 * Created by nan on 10/2/2016.
 */
public enum ErrorEnum {
    InvalidRequest(1000, "Invalid request."),
    UserLogin(1001, "Error user login."),
    GetUserApps(1002, "Error getting user apps."),
    GetAppInfo(1007, "Error getting app info"),
    GetAppTemplate(1008, "Error getting app template"),
    GetAppUsers(1010, "Error getting app users"),
    PublishApp(1012, "Error publishing app"),
    GetCustomApp(1016, "Error getting custom app"),
    SendEmail(1018, "Error sending user email"),
    GetUserInfo(1020, "Error getting user info"),
    FindUserByEmail(1021, "Error finding user by email"),
    AddAppToUser(1022, "Error adding app to user"),
    GetAppUserInfo(1023, "Error getting app user info"),
    LockApp(1024, "Error locking app"),
    GetActiveCustomAppsData(1025, "Error getting active custom apps data"),
    CreateNewOrganization(1026, "Error creating new organization"),
    GetUserBehaviorData(1027, "Error getting user behavior data"),
    InvalidateApp(1028, "Error invalidating app")
    ;


    private ErrorInfo error;

    ErrorEnum(long code, String summary) {
        this.error = new ErrorInfo(code).setSummary(summary);
    }

    public ErrorInfo getError() {
        return error.newInstance();
    }
}
