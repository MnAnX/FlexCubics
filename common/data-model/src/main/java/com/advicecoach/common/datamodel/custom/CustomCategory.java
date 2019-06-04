package com.advicecoach.common.datamodel.custom;

import com.advicecoach.common.datamodel.app.template.AppCategory;
import com.advicecoach.common.datamodel.data.Document;
import com.advicecoach.common.datamodel.data.Feedback;
import com.advicecoach.common.datamodel.data.Video;
import com.advicecoach.common.datamodel.data.Website;
import com.google.common.collect.Lists;
import lombok.Data;

import java.util.List;

/**
 * Created by nanxiao on 8/11/16.
 */
@Data
public class CustomCategory {
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
    private List<Document> documents;
    private Website website;
    private Video youtubeVideo;
    private Video wistiaVideo;

    private boolean hasUpdate = false;

    // Not from app template
    // For PT
    private String numRepetitions;
    private String numSets;
    private String intensity;
    private String frequency;
    private String duration;
    private List<Feedback> feedbackList = Lists.newArrayList();

    public CustomCategory fromAppCategory(AppCategory appCategory) {
        this.categoryId = appCategory.getCategoryId();
        this.groupName = appCategory.getGroupName();
        this.categoryName = appCategory.getCategoryName();
        this.categoryDesc = appCategory.getCategoryDesc();
        this.categoryContent = appCategory.getCategoryContent();
        this.imageUrl = appCategory.getImageUrl();
        this.videoUrl = appCategory.getVideoUrl();
        this.audioUrl = appCategory.getAudioUrl();
        this.documents = appCategory.getDocuments();
        this.website = appCategory.getWebsite();
        this.youtubeVideo = appCategory.getYoutubeVideo();
        this.wistiaVideo = appCategory.getWistiaVideo();

        return this;
    }
}
