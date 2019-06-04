package com.advicecoach.common.api.web.data;

import com.advicecoach.common.datamodel.app.AppType;
import com.advicecoach.common.datamodel.data.Document;
import com.advicecoach.common.datamodel.data.Video;
import com.advicecoach.common.datamodel.data.Website;
import com.google.common.collect.Lists;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Created by Nan on 6/23/2017.
 */
@Data
public class AppTemplateData {
    private Integer templateId = 100;

    // header
    private boolean expanded = true;
    private String label;

    private String header;

    private List<Group> groups = Lists.newArrayList();

    public Group newGroupObject() {
        return new Group();
    }

    public void addGroup(Group group) {
        groups.add(group);
    }

    @Data
    public class Group {
        private boolean expanded = false;
        private String label;

        private String groupId;
        private String groupName;
        private String groupDesc;

        private List<Category> categories = Lists.newArrayList();

        public Category newCategoryObject() {
            return new Category();
        }

        public void addCategory(Category category) {
            categories.add(category);
        }
    }

    @Data
    public class Category {
        private boolean expanded = false;
        private String label;

        private String categoryId;
        private String categoryName;
        private String categoryDesc;
        private String categoryContent;

        private String imageUrl;
        private String videoUrl;
        private Website website;
        private Video youtubeVideo;
        private Video wistiaVideo;

        private List<Document> documents = Lists.newArrayList();
    }
}
