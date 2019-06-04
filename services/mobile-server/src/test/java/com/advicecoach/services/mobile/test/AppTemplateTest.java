package com.advicecoach.services.mobile.test;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.common.datamodel.app.template.AppCategory;
import com.advicecoach.common.datamodel.app.template.AppCategoryGroup;
import com.advicecoach.common.datamodel.app.template.BasicTemplate;
import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.List;

public class AppTemplateTest {
    public static void main(String[] args) {
        Integer appId = 34;
        Integer templateId = 103;

        AppTemplateTest t = new AppTemplateTest();
        t.buildMockApp(appId, templateId);
    }

    public void buildMockApp(Integer appId, Integer templateId) {
        Gson gson = new GsonBuilder().create();

        AppInfo appInfo = AppInfo.builder()
                .appId(appId)
                .appName("Test Playbook")
                .author("Nan Xiao")
                .authorPhotoUrl("https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAA0FAAAAJDA1ZjhmN2FhLWUyNjMtNDUxNS1hOTYwLWE5ZTQyNGM3NTA4MA.jpg")
                .build();

        AppTemplate appTemplate = new AppTemplate();
        appTemplate.setAppId(appId);
        appTemplate.setTemplateId(templateId);
        BasicTemplate template = new BasicTemplate();
        appTemplate.setTemplate(template);

        template.setAppDesc("This is a description of the test app. Please use this app only for testing purpose.");
        template.setHeader("Test Header");
        template.setSummary("This is a summary of the test app.");
        template.setGroups(autoGenGroups(3, 5));

        // Print
        System.out.println("=== App Info ===");
        System.out.println(gson.toJson(appInfo));
        System.out.println("=== App Template ===");
        System.out.println(gson.toJson(appTemplate));
    }

    private List<AppCategoryGroup> autoGenGroups(Integer numGroups, Integer numCategoriesEachGroup) {
        List<AppCategoryGroup> groups = Lists.newArrayList();

        for(int i = 0; i < numGroups; i++) {
            AppCategoryGroup group = genGroup(i);
            for(int j = 0; j < numCategoriesEachGroup; j++) {
                group.addCategory(genCategory(i, j));
            }
            groups.add(group);
        }

        return groups;
    }

    private AppCategoryGroup genGroup(Integer index) {
        AppCategoryGroup group = new AppCategoryGroup();
        group.setGroupId("T103-G" + index);
        group.setGroupName("Group " + index);
        group.setGroupDesc("This is description of group " + index);
        return group;
    }

    private AppCategory genCategory(Integer groupIndex, Integer categoryIndex) {
        AppCategory category = new AppCategory();
        category.setCategoryId("T103-G" + groupIndex + "-C" + categoryIndex);
        category.setGroupName("Group " + groupIndex);
        category.setCategoryName("Category " + categoryIndex);
        category.setCategoryDesc("This is description of category " + categoryIndex + " under group " + groupIndex);
        category.setCategoryContent("This is content of category " + categoryIndex + "." +
                "\n" +
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quis semper leo, eget suscipit neque. Cras pretium risus consectetur nisi convallis semper. Sed tellus sem, vehicula ut volutpat ac, dapibus a lorem. Sed vel velit in tortor tincidunt dignissim. Nulla sed justo eu turpis interdum commodo porttitor quis massa. Vivamus lobortis sapien ac urna lobortis dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam finibus condimentum velit, a fringilla erat dignissim ut. Quisque elit turpis, rutrum sed cursus non, faucibus accumsan elit. Pellentesque ac erat ac mauris cursus molestie eu nec tellus.\n" +
                "\n" +
                "Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque mauris massa, auctor at efficitur sed, efficitur in nisl. Nullam ut ligula metus. Aenean aliquam laoreet volutpat. Nam congue ligula vitae bibendum viverra. Quisque iaculis ante ligula, quis finibus libero maximus ut. Aliquam sed erat lectus. Sed id efficitur turpis. Nulla tincidunt nulla nec lacus rhoncus sagittis.\n" +
                "\n" +
                "Etiam commodo nibh eu diam sollicitudin pulvinar. Nam rutrum, arcu aliquet luctus commodo, quam sem dictum odio, in faucibus libero eros ut elit. Ut porttitor vestibulum egestas. Morbi egestas nisi eu convallis sollicitudin. Etiam convallis auctor tortor vitae volutpat. Praesent ac leo sit amet ex pulvinar lobortis. Suspendisse vitae urna pharetra, ultricies lorem sit amet, vulputate nibh. Sed ultrices placerat orci, et lacinia tortor pulvinar eget. Pellentesque et sollicitudin mi. Nunc ut varius felis, eu suscipit magna. Sed id augue libero. Praesent eu malesuada velit. Vestibulum sit amet ante tellus. Etiam sit amet gravida sapien. Donec faucibus enim neque, eu tempor enim eleifend et. Vivamus arcu massa, vulputate at vulputate nec, blandit sit amet ante.\n" +
                "\n" +
                "Sed efficitur nulla nunc, dapibus porta nisi ultricies sit amet. Mauris ut mauris justo. Aenean non lobortis lorem. Nulla egestas, ante et pellentesque vulputate, mauris ipsum mollis ipsum, id rhoncus erat dolor tristique velit. Nulla massa est, finibus eget auctor eu, accumsan vel lorem. Pellentesque egestas elementum sagittis. Pellentesque molestie mauris vestibulum nisl viverra interdum. Sed euismod augue et erat porttitor, a scelerisque purus dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n" +
                "\n" +
                "Sed sit amet laoreet nulla, sed lobortis nunc. Etiam ut enim eget sapien vehicula interdum. Praesent imperdiet tellus vitae turpis hendrerit consequat. Aliquam mattis nulla sodales lorem dapibus gravida. Fusce sagittis metus id nisi pharetra malesuada. Proin tempus ipsum eros, sed finibus nibh pulvinar pellentesque. Nulla non dui id massa aliquam lobortis. Cras rutrum pulvinar lorem, eu tincidunt leo finibus a. Nullam tellus justo, sodales ut tincidunt vitae, laoreet in risus. Vivamus maximus eget tortor sed posuere. Donec pharetra vestibulum elit vitae scelerisque. Nulla sodales felis vel mi venenatis malesuada. Suspendisse potenti. Sed purus nisi, condimentum a maximus eu, egestas quis quam. Vestibulum posuere orci nec sapien vehicula ultrices. Quisque ut erat felis.");
        if(categoryIndex == 0) {
            category.setImageUrl("http://pegitboard.com/pics/t/124229.gif");
        }
        category.setNumRepetitions(3);
        category.setVideoUrl("At47oE5wtY8");

        return category;
    }
}
