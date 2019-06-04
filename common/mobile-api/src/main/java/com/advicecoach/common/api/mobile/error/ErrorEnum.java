package com.advicecoach.common.api.mobile.error;

/**
 * Created by nan on 10/2/2016.
 */
public enum ErrorEnum {
    InvalidRequest(1000, "Invalid request."),
    UserLogin(1001, "Error in user login."),
    GetAllAvailableApps(1002, "Error in getting all available apps."),
    GetUserApps(1003, "Error in getting all user apps."),
    GetCustomApp(1004, "Error in getting custom app."),
    GetAppTemplate(1005, "Error in getting app template."),
    CreateNewCustomApp(1006, "Error in creating new custom app."),
    GetUserProfile(1012, "Error in getting user profile."),
    AddAppToUser(1016, "Error adding app to user."),
    AddCategoryToCustomApp(1019, "Error adding category to custom app."),
    AddCategoriesToCustomApp(1026, "Error adding categories to custom app."),
    AddUserCategoryToCustomApp(1027, "Error adding user category to custom app"),
    RemoveCategoriesFromCustomApp(1028, "Error removing categories from custom app"),
    ReorderCustomAppCategories(1029, "Error reordering categories."),
    RemoveCustomAppReminder(1030, "Error removing reminder from custom app."),
    UpdateCustomAppReminder(1032, "Error updating custom app reminder"),
    SubmitCustomCategoryAction(1033, "Error submitting custom category action"),
    GetUserNotes(1034, "Error getting user notes"),
    AddUserNote(1035, "Error adding user note"),
    RemoveUserNote(1036, "Error removing user note"),
    UpdateUserNote(1037, "Error updating user note"),
    SyncCustomApp(1038, "Error synchronizing custom app"),
    GetApp(1039, "Error getting app"),
    UpdateCustomAppCategory(1040, "Error updating category of custom app"),
    RemoveAppFromUser(1041, "Error removing app from user"),
    GetUserNotifications(1042, "Error getting user notifications"),
    AddCategoryFeedback(1043, "Error adding category feedback"),
    AddCustomAppGoal(1044, "Error adding custom app goal"),
    UpdateCustomAppGoal(1045, "Error updating custom app goal"),
    AddCustomAppGoalProgress(1046, "Error adding custom app goal progress"),
    RemoveCustomAppGoal(1047, "Error removing custom app goal"),
    UpdateAppTemplate(1048, "Error updating app template"),
    ;

    private ErrorInfo error;

    ErrorEnum(long code, String summary) {
        this.error = new ErrorInfo(code).setSummary(summary);
    }

    public ErrorInfo getError() {
        return error.newInstance();
    }
}
