package com.advicecoach.tools.generator.data.template.generators;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.tools.generator.data.template.FilePaths;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

import java.io.File;

/**
 * Created by nan on 3/26/2017.
 */
public class AppInfoGenerator {
    private final Config config;

    public AppInfoGenerator(String dirPath) {
        File file = new File(dirPath + FilePaths.DEFINITION_FILE);
        config = ConfigFactory.parseFile(file).resolve();
    }

    public AppInfo genAppInfo(int appId) throws Exception {
        AppInfo.AppInfoBuilder info = AppInfo.builder();
        String title = config.getString("title");
        String author = config.getString("author");
        String bookCoverUrl = config.getString("book-cover-url");
        String authorPhotoUrl = config.getString("author-photo-url");
        info.appId(appId)
                .name(title)
                .author(author)
                .coverUrl(bookCoverUrl)
                .authorPhotoUrl(authorPhotoUrl);
        return info.build();
    }
}
