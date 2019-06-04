package com.advicecoach.tools.generator.data.template;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.tools.generator.data.template.generators.AppInfoGenerator;
import com.advicecoach.tools.generator.data.template.generators.AppTemplateGenerator;

import java.io.File;

/**
 * Created by nan on 1/22/2017.
 */
public class AppGenerator {
    private final String configFilesPath;
    private final AppInfoGenerator appInfoGenerator;
    private final AppTemplateGenerator appTemplateGenerator;

    public AppGenerator(final String configFilesBasePath, final String appName) {
        this.configFilesPath = configFilesBasePath + File.separator + appName + File.separator;
        appInfoGenerator = new AppInfoGenerator(configFilesPath);
        appTemplateGenerator = new AppTemplateGenerator(configFilesPath);
    }

    public AppInfo genAppInfo(int appId) throws Exception {
        return appInfoGenerator.genAppInfo(appId);
    }

    public AppTemplate genAppTemplate() throws Exception {
        return appTemplateGenerator.genAppTemplate();
    }
}
