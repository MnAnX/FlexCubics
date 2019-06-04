package com.advicecoach.common.datamodel.app.template;

import com.advicecoach.common.datamodel.data.Document;
import com.advicecoach.common.datamodel.data.Video;
import com.advicecoach.common.datamodel.data.Website;
import com.google.common.collect.Lists;
import lombok.Data;

import java.util.List;

/**
 * Created by nan on 11/1/2016.
 */
@Data
public class AppCategory {
    // IDs
    private String categoryId;

    // Attributes
    private String groupName;
    private String categoryName;
    private String categoryDesc;
    private String categoryContent;

    private String imageUrl;
    private String videoUrl;
    private String audioUrl;
    private Website website;
    private Video youtubeVideo;
    private Video wistiaVideo;

    private List<Document> documents = Lists.newArrayList();
}