package com.advicecoach.common.api.mobile.msg;

import com.advicecoach.common.datamodel.data.Reminder;
import lombok.Data;

/**
 * Created by nan on 12/31/2016.
 */
@Data
public class RemoveCustomAppReminderReq {
    private Integer customAppId;
    private Reminder reminder;
}
