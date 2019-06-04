package com.advicecoach.tools.generator.data.template.generators;

import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

import java.io.File;
import java.util.List;

/**
 * Created by nan on 3/26/2017.
 */
public class InventoryImageLoader {
    private final Config config;

    public InventoryImageLoader(String filePath) {
        File file = new File(filePath);
        config = ConfigFactory.parseFile(file).resolve();
    }

    public boolean contains(String categoryId) {
        if(categoryId.contains(":")){
            categoryId = "\"" + categoryId + "\"";
        }
        return config.hasPath(categoryId);
    }

    public List<String> getPictureListOfCategory(String categoryId) {
        if(categoryId.contains(":")){
            categoryId = "\"" + categoryId + "\"";
        }
        return config.getStringList(categoryId);
    }
}
