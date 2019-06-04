package com.advicecoach.services.web.impl.data;

import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

/**
 * Created by Nan on 8/7/2017.
 */
public class ConfigData {
    private Config templatesConfig;

    public ConfigData initialize() throws Exception {
        this.templatesConfig = ConfigFactory.load("templates");
        return this;
    }

    public Config getTemplateConfig(Integer templateId) {
        String tid = String.valueOf(templateId);
        if (!templatesConfig.hasPath(tid)) {
            tid = "100";
        }
        Config templateConfig = templatesConfig.getConfig(tid);

        return templateConfig;
    }

    // Helpers

    public class ConfigException extends Exception {
        public ConfigException(String error) {
            super(error);
        }
    }
}
