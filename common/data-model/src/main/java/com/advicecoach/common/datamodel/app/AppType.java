package com.advicecoach.common.datamodel.app;

/**
 * Created by nan on 2/5/2017.
 */
public enum AppType {
    Standard(1),
    LibraryOnly(2),
    PreloadPlan(3),
    ;

    private int val;

    private AppType(int val) {
        this.val = val;
    }

    public int getVal() {
        return val;
    }

    public boolean is(int val) {
        if (this.val == val)
            return true;
        return false;
    }
}
