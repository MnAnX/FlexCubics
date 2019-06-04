package com.advicecoach.common.datamodel.data;

import lombok.Data;

@Data
public class Reminder {
    private String reminderId;
    private String date;
    private String time;
    private boolean isRepeat = false;
    private String frequency;
    private String endDate;
}
