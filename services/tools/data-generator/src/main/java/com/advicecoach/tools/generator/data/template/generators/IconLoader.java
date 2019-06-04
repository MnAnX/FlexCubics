package com.advicecoach.tools.generator.data.template.generators;

import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

import java.io.File;

/**
 * Created by nan on 3/26/2017.
 */
public class IconLoader {
    private final Config config;

    public IconLoader(String filePath) {
        File file = new File(filePath);
        config = ConfigFactory.parseFile(file).resolve();
    }

    public boolean contains(String category) {
        if(category.contains(":")){
            category = "\"" + category + "\"";
        }
        return config.hasPath(category);
    }

    public String getUrl(String category) {
        if(category.contains(":")){
            category = "\"" + category + "\"";
        }
        return config.getString(category);
    }
}
