package com.advicecoach.common.api.mobile.data;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.custom.CustomApp;
import lombok.Data;

/**
 * Created by nan on 2/5/2017.
 */
@Data
public class UserApp {
    private AppInfo appInfo;
    private Integer customAppId;
}
