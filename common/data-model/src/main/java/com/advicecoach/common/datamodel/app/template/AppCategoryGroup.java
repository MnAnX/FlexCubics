package com.advicecoach.common.datamodel.app.template;

import com.google.common.collect.Lists;
import lombok.Data;

import java.util.List;

/**
 * Created by nan on 11/1/2016.
 */
@Data
public class AppCategoryGroup {
    // IDs
    private String groupId;

    // Attributes
    private String groupName;
    private String groupDesc;

    // Categories
    private List<AppCategory> categories = Lists.newArrayList();

    public void addCategory(AppCategory category) {
        categories.add(category);
    }

    public void setCategory(int index, AppCategory category){
        categories.set(index, category);
    }
}