package com.advicecoach.common.datamodel.app.template;

import com.google.common.collect.Lists;
import lombok.Data;

import java.util.List;

/**
 * Created by nan on 11/1/2016.
 */
@Data
public class BasicTemplate {
    // Attributes
    private String appDesc;
    private String header;
    private String summary;

    // Groups
    private List<AppCategoryGroup> groups = Lists.newArrayList();

    public void addGroup(AppCategoryGroup newGroup) {
        groups.add(newGroup);
    }
}