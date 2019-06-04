package com.advicecoach.services.web.impl.objects;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppTemplate;
import lombok.Data;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class AppData {
    private AppInfo appInfo;
    private AppTemplate appTemplate;
}
