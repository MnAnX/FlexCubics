package com.advicecoach.common.datamodel.custom;

import com.advicecoach.common.datamodel.app.AppData;
import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.data.Feedback;
import com.advicecoach.common.datamodel.data.Goal;
import com.advicecoach.common.datamodel.data.Reminder;
import com.google.common.base.Strings;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.TreeMap;

/**
 * Created by nanxiao on 9/6/16.
 */
@Data
public class CustomApp {
    // IDs
    private Integer customAppId;
    private Integer userId;
    private Integer appId;
    private Integer templateId;

    // Attributes
    private AppInfo appInfo;
    private String appDesc;
    private String appSummary;
    private String appHeader;
    private String logoImageUrl;

    private String coverImageUrl;
    private Reminder reminder;

    private Integer points = 0;

    private boolean lockActions = false;
    private String actionCode;

    private List<Feedback> feedbackList = Lists.newArrayList();
    private List<Goal> goals = Lists.newArrayList();

    // Categories
    private TreeMap<Integer, CustomCategory> categories = Maps.newTreeMap();  // Index/Category
    private HashMap<String, Integer> idIndexMap = Maps.newHashMap();  // ID/Index

    public CustomApp initialize(Integer userId, AppData appData) {
        this.userId = userId;
        this.fromAppData(appData);
        return this;
    }

    public CustomApp fromAppData(AppData appData) {
        this.appId = appData.getAppInfo().getAppId();
        this.templateId = appData.getAppTemplate().getTemplateId();
        this.appInfo = appData.getAppInfo();
        this.appDesc = appData.getAppTemplate().getTemplate().getAppDesc();
        this.appSummary = appData.getAppTemplate().getTemplate().getSummary();
        this.appHeader = appData.getAppTemplate().getTemplate().getHeader();
        this.logoImageUrl = appData.getAppInfo().getLogoImageUrl();
        this.coverImageUrl = !Strings.isNullOrEmpty(appData.getAppInfo().getCoverUrl())
                ? appData.getAppInfo().getCoverUrl()
                : appData.getAppInfo().getDefaultCoverUrl();
        this.lockActions = appData.getAppInfo().isLockActions();
        this.actionCode = appData.getAppInfo().getActionCode();

        return this;
    }

    public CustomCategory getCategory(String id) {
        Integer index = idIndexMap.get(id);
        return categories.get(index);
    }

    public void setCategory(String id, CustomCategory category) {
        Integer index = idIndexMap.get(id);
        categories.put(index, category);
    }

    public void addCategory(Integer index, String id, CustomCategory category) {
        idIndexMap.put(id, index);
        categories.put(index, category);
    }

    public void removeCategory(String id) {
        Integer index = idIndexMap.get(id);
        categories.remove(index);
        idIndexMap.remove(id);
    }

    public void clearCategories() {
        categories.clear();
        idIndexMap.clear();
    }

    public boolean containsCategory(String id) {
        return idIndexMap.containsKey(id);
    }
}
