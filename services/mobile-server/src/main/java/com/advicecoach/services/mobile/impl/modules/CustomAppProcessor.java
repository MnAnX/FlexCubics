package com.advicecoach.services.mobile.impl.modules;

import com.advicecoach.common.api.mobile.data.CustomCategoryActionType;
import com.advicecoach.common.datamodel.app.AppData;
import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.common.datamodel.app.AppType;
import com.advicecoach.common.datamodel.app.template.AppCategory;
import com.advicecoach.common.datamodel.app.template.AppCategoryGroup;
import com.advicecoach.common.datamodel.custom.CustomApp;
import com.advicecoach.common.datamodel.custom.CustomCategory;
import com.advicecoach.common.datamodel.data.Feedback;
import com.advicecoach.common.datamodel.data.Goal;
import com.advicecoach.common.datamodel.data.Progress;
import com.advicecoach.services.mobile.impl.data.Points;
import com.google.api.client.util.Lists;
import com.google.api.client.util.Maps;
import lombok.extern.slf4j.Slf4j;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;

/**
 * Created by Nan on 8/17/2017.
 */
@Slf4j
public class CustomAppProcessor {
    private final Utils utils;

    public CustomAppProcessor() {
        utils = new Utils();
    }

    public Map<String, AppCategory> getAppCategoryMap(AppTemplate appTemplate) {
        Map<String, AppCategory> catMap = Maps.newHashMap();  // CategoryID / AppCategory
        appTemplate.getTemplate().getGroups().forEach(g -> g.getCategories().forEach(c -> catMap.put(c.getCategoryId(), c)));
        return catMap;
    }

    public CustomApp createNewCustomApp(Integer userId, AppData appData) {
        CustomApp customApp = new CustomApp().initialize(userId, appData);

        // determine if need to preload categories to the custom app
        boolean shouldPreloadLibrary;
        if(appData.getAppInfo().getAppType() == null) appData.getAppInfo().setAppType(AppType.Standard);
        switch (appData.getAppInfo().getAppType()) {
            case Standard:
                shouldPreloadLibrary = false;
                break;
            case LibraryOnly:
                shouldPreloadLibrary = true;
                break;
            case PreloadPlan:
                shouldPreloadLibrary = true;
                break;
            default:
                shouldPreloadLibrary = false;
        }

        if(shouldPreloadLibrary) {
            List<String> categoryIDs = com.google.common.collect.Lists.newArrayList();
            appData.getAppTemplate().getTemplate().getGroups().forEach(g -> g.getCategories().forEach(c -> categoryIDs.add(c.getCategoryId())));

            Map<String, AppCategory> appCategoryMap = getAppCategoryMap(appData.getAppTemplate());
            int index = getCategoryStartingIndex();
            for (String id : categoryIDs) {
                if (!appCategoryMap.containsKey(id)) {
                    log.error("Invalid category ID [{}] for app [{}]", id, appData.getAppInfo().getAppId());
                    continue;
                }
                // create custom category from app category data
                CustomCategory customCategory = new CustomCategory().fromAppCategory(appCategoryMap.get(id));

                customApp.addCategory(index, id, customCategory);
                index++;
            }
        }

        // add initial points
        Integer newPoints = customApp.getPoints() + Points.CreateCustomApp.getPoints();
        customApp.setPoints(newPoints);

        return customApp;
    }

    public CustomApp addCategoriesToCustomApp(CustomApp customApp, List<String> newCategoryIDs, AppTemplate appTemplate) {
        Map<String, AppCategory> appCategoryMap = getAppCategoryMap(appTemplate);
        int index = getNewCategoryIndex(customApp);
        for (String categoryId : newCategoryIDs) {
            if (customApp.containsCategory(categoryId)) {
                log.info("Category [{}] already exists on the custom app [{}]. Will not add again.", categoryId, customApp.getCustomAppId());
                continue;
            }
            if (!appCategoryMap.containsKey(categoryId)) {
                log.error("Invalid category ID [{}] for app [{}]", categoryId, customApp.getAppId());
                continue;
            }

            // create custom category from app category data
            CustomCategory customCategory = new CustomCategory().fromAppCategory(appCategoryMap.get(categoryId));

            customApp.addCategory(index, categoryId, customCategory);
            index++;
        }
        return customApp;
    }

    public CustomApp removeCategoriesFromCustomApp(CustomApp customApp, List<String> toRemoveCategoryIDs) {
        for (String categoryId : toRemoveCategoryIDs) {
            if (!customApp.containsCategory(categoryId)) {
                log.info("Category [{}] does not exist on the custom app [{}]. Will not remove.", categoryId, customApp.getCustomAppId());
                continue;
            }
            customApp.removeCategory(categoryId);
        }
        return customApp;
    }

    public CustomApp reorderCategoriesInCustomApp(CustomApp customApp, List<String> newOrderCategoryIDs) {
        List<CustomCategory> orderedCategoryList = Lists.newArrayList();
        for (String categoryId : newOrderCategoryIDs) {
            if (customApp.containsCategory(categoryId)) {
                orderedCategoryList.add(customApp.getCategory(categoryId));
            }
        }
        customApp.clearCategories();
        int index = getCategoryStartingIndex();
        for (CustomCategory c : orderedCategoryList) {
            customApp.addCategory(index, c.getCategoryId(), c);
            index++;
        }
        return customApp;
    }

    public CustomApp addUserCategory(CustomApp customApp, CustomCategory newCategory) {
        int index = getNewCategoryIndex(customApp);
        String categoryId = genUserCategoryId(customApp);
        newCategory.setCategoryId(categoryId);
        newCategory.setGroupName(" "); // set empty group name for customize category
        customApp.addCategory(index, categoryId, newCategory);
        return customApp;
    }

    public CustomApp editCategory(CustomApp customApp, String categoryId, CustomCategory category) {
        CustomCategory originalCategory = customApp.getCategory(categoryId);
        category.setCategoryId(originalCategory.getCategoryId());
        category.setGroupName(originalCategory.getGroupName());
        customApp.setCategory(categoryId, category);
        return customApp;
    }

    public CustomApp customCategoryAction(CustomApp customApp, CustomCategoryActionType actionType, String actionData) {
        switch (actionType) {
            case DidItOnce:
                addPointsToCustomApp(customApp, Points.DidCategoryOnce);
                break;
            case Enter:
                addPointsToCustomApp(customApp, Points.EnterCategory);
                break;
            default:
                // do nothing
        }
        return customApp;
    }

    public CustomApp syncCustomApp(CustomApp customApp, AppData appData) {
        AppInfo appInfo = appData.getAppInfo();
        AppTemplate appTemplate = appData.getAppTemplate();
        customApp.setAppInfo(appInfo);
        customApp.setAppDesc(appTemplate.getTemplate().getAppDesc());
        customApp.setLogoImageUrl(appInfo.getLogoImageUrl());
        customApp.setLockActions(appInfo.isLockActions());
        customApp.setActionCode(appInfo.getActionCode());
        if(AppType.LibraryOnly.equals(appData.getAppInfo().getAppType())) {
            // for library only app, sync all the categories from library to custom app
            customApp.clearCategories();
            int index = getCategoryStartingIndex();
            for (AppCategoryGroup appGroup : appTemplate.getTemplate().getGroups()) {
                for(AppCategory appCategory : appGroup.getCategories()) {
                    CustomCategory customCategory = new CustomCategory().fromAppCategory(appCategory);
                    customApp.addCategory(index++, appCategory.getCategoryId(), customCategory);
                }
            }
        }
        return customApp;
    }

    public CustomApp addFeedback(CustomApp customApp, String categoryId, String feedbackStr) {
        // create feedback
        Feedback feedback = new Feedback();
        feedback.setContent(feedbackStr);
        feedback.setTime(utils.getCurrentUtcTime());
        // add feedback to custom app
        customApp.getFeedbackList().add(feedback);
        // add feedback to category
        CustomCategory category = customApp.getCategory(categoryId);
        category.getFeedbackList().add(feedback);
        return customApp;
    }

    public CustomApp addGoal(CustomApp customApp, String goal, String endTime) {
        Goal newGoal = new Goal();
        newGoal.setId(System.currentTimeMillis()); // use timestamp as id
        newGoal.setGoal(goal);
        newGoal.setStartTime(utils.getCurrentUtcTime());
        newGoal.setEndTime(endTime);
        customApp.getGoals().add(newGoal);
        return customApp;
    }

    public CustomApp updateGoal(CustomApp customApp, Long goalId, String goal, String endTime) {
        Goal updatedGoal = customApp.getGoals().stream()
                .filter(g -> g.getId().equals(goalId))
                .findFirst()
                .get();
        updatedGoal.setGoal(goal);
        updatedGoal.setEndTime(endTime);
        return customApp;
    }

    public CustomApp removeGoal(CustomApp customApp, Long goalId) {
        customApp.getGoals()
                .removeIf(g -> g.getId().equals(goalId));
        return customApp;
    }

    public CustomApp addGoalProgress(CustomApp customApp, Long goalId, String progressStr) {
        // create progress
        Progress progress = new Progress();
        progress.setProgress(progressStr);
        progress.setTime(utils.getCurrentUtcTime());
        // add progress to goal on custom app
        customApp.getGoals().stream()
                .filter(g -> g.getId().equals(goalId))
                .findFirst()
                .get()
                .getProgressList().add(progress);
        return customApp;
    }

    // Helper

    private int addPointsToCustomApp(CustomApp customApp, Points type) {
        int newPoints = customApp.getPoints() + type.getPoints();
        customApp.setPoints(newPoints);
        return newPoints;
    }


    private int getNewCategoryIndex(CustomApp customApp) {
        log.trace("number of categories: " + customApp.getCategories().size());
        if (customApp.getCategories() != null && customApp.getCategories().size() > 0) {
            int index = customApp.getCategories().lastKey() + 1;  // create new indexes greater than the current max index
            return index;
        } else {
            return getCategoryStartingIndex();
        }
    }

    private int getCategoryStartingIndex() {
        return 0; // start index from 0
    }

    private String genUserCategoryId(CustomApp customApp) {
        StringBuilder id = new StringBuilder()
                .append("T").append(customApp.getTemplateId()).append("-")
                .append("GU-")
                .append("C").append(System.currentTimeMillis());
        return id.toString();
    }
}
