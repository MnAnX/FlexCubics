package com.advicecoach.tools.generator.data.template.generators;

import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

import java.io.File;
import java.util.List;

/**
 * Created by nan on 3/26/2017.
 */
public class DefinitionLoader {
    private final Config config;

    public DefinitionLoader(String filePath) {
        File file = new File(filePath);
        config = ConfigFactory.parseFile(file).resolve();
    }

    public String getString(String name) {
        return config.getString(name);
    }

    public Integer getInt(String name){
        return config.getInt(name);
    }

    public boolean contains(String name){
        return config.hasPath(name);
    }
}
