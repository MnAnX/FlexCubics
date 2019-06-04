package com.advicecoach.common.api.web.error;

/**
 * Created by nan on 10/2/2016.
 */
public enum ErrorEnum {
    InvalidRequest(1000, "Invalid request."),
    UserLogin(1001, "Error user login."),
    GetUserApps(1002, "Error getting user apps."),
    CreateNewApp(1003, "Error creating new app."),
    UpdateAppInfo(1004, "Error updating info of the app."),
    UpdateAppTemplate(1005, "Error updating template of the app."),
    StartTestingApp(1006, "Error start testing app"),
    GetAppInfo(1007, "Error getting app info"),
    GetAppTemplate(1008, "Error getting app template"),
    InviteUserToApp(1009, "Error inviting user to app"),
    GetAppUsers(1010, "Error getting app users"),
    GetS3SignedUrl(1011, "Error getting signed URL of aws s3"),
    PublishApp(1012, "Error publishing app"),
    RemoveAppUser(1013, "Error removing app user"),
    InvalidateApp(1015, "Error invalidating app"),
    GetCustomApp(1016, "Error getting custom app"),
    GetCustomAppTemplate(1017, "Error getting custom app template"),
    SendEmail(1018, "Error sending user email"),
    SendPushNotification(1019, "Error sending user push notification"),
    GetUserInfo(1020, "Error getting user info"),
    FindUserByEmail(1021, "Error finding user by email"),
    GetOrgInfoData(1022, "Error getting organization info and data"),
    UpdateOrgData(1023, "Error updating organization data"),
    SubmitSubscription(1024, "Error submitting subscription"),
    GetSubscriptionData(1025, "Error getting subscription data"),
    ManageMemberInOrg(1026, "Error managing member in organization"),
    CloneApp(1027, "Error cloning app"),
    AddCustomCategoryToAppTemplate(1028, "Error adding custom category to app template"),
    ;


    private ErrorInfo error;

    ErrorEnum(long code, String summary) {
        this.error = new ErrorInfo(code).setSummary(summary);
    }

    public ErrorInfo getError() {
        return error.newInstance();
    }
}
