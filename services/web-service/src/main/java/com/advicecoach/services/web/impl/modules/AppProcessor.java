package com.advicecoach.services.web.impl.modules;

import com.advicecoach.common.api.web.data.AppTemplateData;
import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppStatus;
import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.common.datamodel.app.template.AppCategory;
import com.advicecoach.common.datamodel.app.template.AppCategoryGroup;
import com.advicecoach.common.datamodel.app.template.BasicTemplate;
import com.advicecoach.common.datamodel.custom.CustomCategory;
import com.advicecoach.services.web.impl.data.ConfigData;
import com.google.common.collect.Lists;
import com.typesafe.config.Config;

import java.util.List;
import java.util.UUID;

/**
 * Created by Nan on 6/24/2017.
 */
public class AppProcessor {
    private ConfigData configData;

    public AppProcessor setConfigData(ConfigData configData) {
        this.configData = configData;
        return this;
    }

    public AppInfo initializeNewAppInfo(AppInfo appInfo) {
        Config templateConfig = configData.getTemplateConfig(appInfo.getTemplateId());
        // Set default cover
        appInfo.setDefaultCoverUrl(templateConfig.getString("defaultCoverUrl"));
        // Publish new app directly
        appInfo.setAppStatus(AppStatus.Published);

        return appInfo;
    }

    public AppTemplate initializeNewAppTemplate(AppInfo appInfo) {
        if (appInfo.getTemplateId() == null) {
            appInfo.setTemplateId(100);
        }
        AppTemplate appTemplate = new AppTemplate();
        appTemplate.setTemplateId(appInfo.getTemplateId());
        BasicTemplate template = new BasicTemplate();

        String defaultHeader = appInfo.getAppName();

        //--- Initialize template data
        template.setHeader(defaultHeader);

        appTemplate.setTemplate(template);

        return appTemplate;
    }

    public AppTemplate convertToAppTemplate(Integer appId, AppTemplateData appTemplateData) {
        // Convert app template data with front-end format to internal app template format
        AppTemplate appTemplate = new AppTemplate();
        appTemplate.setAppId(appId);
        appTemplate.setTemplateId(appTemplateData.getTemplateId());

        BasicTemplate template = new BasicTemplate();
        template.setHeader(appTemplateData.getHeader());
        // Process groups
        List<AppTemplateData.Group> groups = appTemplateData.getGroups();
        if (groups != null && !groups.isEmpty()) {
            for (int groupIndex = 0; groupIndex < groups.size(); groupIndex++) {
                // Per GROUP Data
                AppTemplateData.Group groupData = groups.get(groupIndex);
                // Initialize a new group, and populate with group data
                AppCategoryGroup group = new AppCategoryGroup();
                group.setGroupId(generateGroupId(appTemplateData.getTemplateId(), groupIndex));
                group.setGroupName(groupData.getGroupName());
                group.setGroupDesc(groupData.getGroupDesc());

                // Process categories
                List<AppTemplateData.Category> categories = groupData.getCategories();
                if (categories != null && !categories.isEmpty()) {
                    for (int categoryIndex = 0; categoryIndex < categories.size(); categoryIndex++) {
                        // Per CATEGORY Data
                        AppTemplateData.Category categoryData = categories.get(categoryIndex);
                        // Initialize a new category, and populate with category data
                        AppCategory category = new AppCategory();
                        category.setCategoryId(generateCategoryId(appTemplateData.getTemplateId(), groupIndex, categoryIndex));
                        category.setGroupName(groupData.getGroupName());
                        category.setCategoryName(categoryData.getCategoryName());
                        category.setCategoryDesc(categoryData.getCategoryDesc());
                        category.setCategoryContent(categoryData.getCategoryContent());
                        category.setImageUrl(categoryData.getImageUrl());
                        category.setVideoUrl(categoryData.getVideoUrl());
                        category.setDocuments(categoryData.getDocuments());
                        category.setWebsite(categoryData.getWebsite());
                        category.setYoutubeVideo(categoryData.getYoutubeVideo());
                        category.setWistiaVideo(categoryData.getWistiaVideo());

                        // Add the processed category
                        group.addCategory(category);
                    }
                }

                // Add the processed group
                template.addGroup(group);
            }
        }
        appTemplate.setTemplate(template);

        return appTemplate;
    }

    public AppTemplateData convertToAppTemplateData(AppTemplate appTemplate) {
        AppTemplateData appTemplateData = new AppTemplateData();
        appTemplateData.setTemplateId(appTemplate.getTemplateId());

        // Header
        appTemplateData.setHeader(appTemplate.getTemplate().getHeader());

        // Groups
        if (appTemplate.getTemplate().getGroups() != null) {
            for (AppCategoryGroup group : appTemplate.getTemplate().getGroups()) {
                AppTemplateData.Group groupData = appTemplateData.newGroupObject();
                groupData.setGroupName(group.getGroupName());
                groupData.setGroupDesc(group.getGroupDesc());

                // categories
                for (AppCategory category : group.getCategories()) {
                    AppTemplateData.Category categoryData = groupData.newCategoryObject();
                    categoryData.setCategoryName(category.getCategoryName());
                    categoryData.setCategoryDesc(category.getCategoryDesc());
                    categoryData.setCategoryContent(category.getCategoryContent());
                    categoryData.setImageUrl(category.getImageUrl());
                    categoryData.setVideoUrl(category.getVideoUrl());
                    categoryData.setDocuments(category.getDocuments());
                    categoryData.setWebsite(category.getWebsite());
                    categoryData.setYoutubeVideo(category.getYoutubeVideo());
                    categoryData.setWistiaVideo(category.getWistiaVideo());

                    // add category to chapter
                    groupData.addCategory(categoryData);
                }

                // add chapter to header
                appTemplateData.addGroup(groupData);
            }
        }

        return appTemplateData;
    }

    public AppTemplate addCustomCategoryToAppTemplate(AppTemplate appTemplate, CustomCategory customCategory) {
        String groupName = "Custom";
        // Convert custom category to app category
        AppCategory appCategory = new AppCategory();
        String categoryId = UUID.randomUUID().toString();
        appCategory.setCategoryId(categoryId);
        appCategory.setGroupName(groupName);
        appCategory.setCategoryName(customCategory.getCategoryName());
        appCategory.setCategoryDesc(customCategory.getCategoryDesc());
        appCategory.setImageUrl(customCategory.getImageUrl());
        appCategory.setVideoUrl(customCategory.getVideoUrl());
        // Add all custom categories to group 'Custom'
        boolean hasCustomGroup = false;
        for (AppCategoryGroup group : appTemplate.getTemplate().getGroups()) {
            if (group.getGroupName().equalsIgnoreCase(groupName)) {
                // add to this group
                group.addCategory(appCategory);
                hasCustomGroup = true;
            }
        }
        if(!hasCustomGroup) {
            // add a new Custom group and add the category to it
            // construct the group
            AppCategoryGroup newGroup = new AppCategoryGroup();
            newGroup.setGroupId(generateGroupId(appTemplate.getTemplateId(), appTemplate.getTemplate().getGroups().size()));
            newGroup.setGroupName(groupName);
            List<AppCategory> categories = Lists.newArrayList(appCategory);
            newGroup.setCategories(categories);
            // add the group to template
            appTemplate.getTemplate().addGroup(newGroup);
        }

        return appTemplate;
    }

    private String generateGroupId(Integer templateId, Integer groupIndex) {
        // Format: T<template_id>-G<group_id>, e.g. T101-G1
        String groupId = new StringBuilder("T")
                .append(templateId)
                .append("-G")
                .append(groupIndex).toString();
        return groupId;
    }

    private String generateCategoryId(Integer templateId, Integer groupIndex, Integer categoryIndex) {
        // Format: T<template_id>-G<group_index>-C<category_index>, e.g. T101-G1-C1
        String chapterId = new StringBuilder("T")
                .append(templateId)
                .append("-G")
                .append(groupIndex)
                .append("-C")
                .append(categoryIndex)
                .toString();
        return chapterId;
    }

    private String generateCategoryId(String groupId, Integer categoryIndex) {
        String chapterId = new StringBuilder(groupId)
                .append("-C")
                .append(categoryIndex)
                .toString();
        return chapterId;
    }

    private List<String> getInventoryImageList(String images) {
        List<String> imageList = Lists.newArrayList();
        if (images != null && !images.isEmpty()) {
            String[] imageUrls = images.split(",");
            for (String imageUrl : imageUrls) {
                imageList.add(imageUrl.trim());
            }
        }
        return imageList;
    }

    private String getStepEstimatedTimeString(String estimatedTimeValue, String estimatedTimeUnit) {
        StringBuilder estTime = new StringBuilder(estimatedTimeValue).append(" ").append(estimatedTimeUnit);
        return estTime.toString();
    }
}
