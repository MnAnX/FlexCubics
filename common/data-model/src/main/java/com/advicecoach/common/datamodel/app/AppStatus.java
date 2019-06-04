package com.advicecoach.common.datamodel.app;

/**
 * Created by Nan on 4/20/2017.
 */
public enum AppStatus {
    // ----- Published (0~100) -----
    Default(0),  // Put on shelf by default
    Listed(10),  // Can be explored by any user
    Published(30), // Can be looked up by any user
    InvitationOnly(50),
    // ----- Unpublished (101~499) -----
    Testing(200),
    Editing(300),
    // ----- Not shown under user (500~998) -----
    OrgLibrary(500),  // Central library of organization
    // Invalid (999)
    Invalid(999);

    private int val;

    AppStatus(int val) {
        this.val = val;
    }

    public int getVal() {
        return val;
    }

    public static AppStatus parse(int val) {
        for (AppStatus s : AppStatus.values()) {
            if (s.getVal() == val) {
                return s;
            }
        }
        return Invalid;
    }
}
