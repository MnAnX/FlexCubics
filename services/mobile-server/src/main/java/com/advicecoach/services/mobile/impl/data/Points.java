package com.advicecoach.services.mobile.impl.data;

/**
 * Created by nanxiao on 8/11/17.
 */
public enum Points {
    CreateCustomApp(50),
    SetReminder(10),
    AddPhoto(10),
    DidCategoryOnce(100),
    EnterCategory(10),
    ;

    // helper
    private Integer points;

    Points(Integer points) {
        this.points = points;
    }

    public Integer getPoints() {
        return points;
    }
}
