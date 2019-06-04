package com.advicecoach.tools.generator.data.template.generators;

import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.common.datamodel.app.template.AppCategory;
import com.advicecoach.common.datamodel.app.template.AppCategoryGroup;
import com.advicecoach.common.datamodel.app.template.AppPictureLibrary;
import com.advicecoach.common.datamodel.app.template.BasicTemplate;
import com.advicecoach.tools.generator.data.template.FilePaths;
import com.google.api.client.util.Maps;
import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.ListMultimap;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

/**
 * Created by nan on 3/26/2017.
 */
public class AppTemplateGenerator {
    private final StructureLoader structureLoader;
    private final DefinitionLoader definitionLoader;
    private final IconLoader iconLoader;
    private final InventoryImageLoader motivationImagesLoader;
    private final InventoryImageLoader achievementImagesLoader;

    public AppTemplateGenerator(String dirPath) {
        structureLoader = new StructureLoader(dirPath + FilePaths.STRUCTURE_FILE);
        definitionLoader = new DefinitionLoader(dirPath + FilePaths.DEFINITION_FILE);
        iconLoader = new IconLoader(dirPath + FilePaths.ICONS_FILE);
        motivationImagesLoader = new InventoryImageLoader(dirPath + FilePaths.MOTIVATION_PIC_FILE);
        achievementImagesLoader = new InventoryImageLoader(dirPath + FilePaths.ACHIEVEMENT_PIC_FILE);
    }

    public AppTemplate genAppTemplate() throws Exception {
        AppTemplate appTemplate = initAppTemplate();

        List<AppCategoryGroup> categoryStructure = structureLoader.importStructure();
        Map<String, Object> structureMap = indexStructure(categoryStructure);

        populateIcons(structureMap);
        populatePictures(structureMap, AppPictureLibrary.LibraryType.Motivation, motivationImagesLoader);
        populatePictures(structureMap, AppPictureLibrary.LibraryType.Achievement, achievementImagesLoader);
        updateCategoryStructureWithStructureMap(structureMap, categoryStructure);

        BasicTemplate template = new BasicTemplate();
        template.setGroups(categoryStructure);
        appTemplate.setTemplate(template);

        return appTemplate;
    }

    private AppTemplate initAppTemplate() throws Exception {
        // populate AppTemplate with definitions
        AppTemplate appTemplate = new AppTemplate();

        // App ID (required)
        if (!definitionLoader.contains("type-id")) {
            throw new Exception("Missing Type ID");
        }
        int typeId = definitionLoader.getInt("type-id");
        appTemplate.setTypeId(typeId);

        // Header (optional)
        String header = "Categories";  // Default header
        if (definitionLoader.contains("header")) {
            header = definitionLoader.getString("header");
        }
        appTemplate.setListTitle(header);

        // On Boarding Screen URL (optional)
        if (definitionLoader.contains("on-boarding-screen-url")) {
            appTemplate.setOnBoardingScreenUrl(definitionLoader.getString("on-boarding-screen-url"));
        }

        // Default image URL (optional)
        if (definitionLoader.contains("default-image-url")) {
            appTemplate.setDefaultImageUrl(definitionLoader.getString("default-image-url"));
        }

        return appTemplate;
    }

    private Map<String, Object> indexStructure(List<AppCategoryGroup> categoryStructure) {
        // index all the groups and categories by their id
        Map<String, Object> index = Maps.newHashMap();
        categoryStructure.forEach(g -> {
            index.put(g.getId(), g);
            g.getCategories().forEach(c -> {
                index.put(c.getId(), c);
            });
        });
        return index;
    }

    private void populateIcons(Map<String, Object> structure) {
        structure.entrySet().forEach(e -> {
            if (iconLoader.contains(e.getKey())) {
                String icon = iconLoader.getUrl(e.getKey());
                Object obj = e.getValue();
                if (obj instanceof AppCategoryGroup) {
                    // set icon on group
                    ((AppCategoryGroup) obj).setIconUrl(icon);
                }
            }
        });
    }

    private void populatePictures(Map<String, Object> structure, AppPictureLibrary.LibraryType type, InventoryImageLoader imageLoader) {
        structure.entrySet().forEach(e -> {
            if (imageLoader.contains(e.getKey())) {
                List<String> pics = imageLoader.getPictureListOfCategory(e.getKey());
                Object obj = e.getValue();
                if (obj instanceof AppCategory) {
                    // set pictures on category
                    AppCategory category = ((AppCategory) obj);
                    switch (type) {
                        case Motivation:
                            category.getMotivationPictureLibrary().setPictureUrls(pics);
                            break;
                        case Achievement:
                            category.getAchievementPictureLibrary().setPictureUrls(pics);
                            break;
                    }
                }
            }
        });
    }

    private void updateCategoryStructureWithStructureMap(Map<String, Object> structureMap, List<AppCategoryGroup> categoryStructure) {
        for (int i = 0; i < categoryStructure.size(); i++) {
            AppCategoryGroup group = categoryStructure.get(i);
            if (structureMap.containsKey(group.getId())) {
                group = (AppCategoryGroup) structureMap.get(group.getId());
            }
            for (int j = 0; j < group.getCategories().size(); j++) {
                AppCategory category = group.getCategories().get(j);
                if (structureMap.containsKey(category.getId())) {
                    category = (AppCategory) structureMap.get(category.getId());
                    group.setCategory(j, category);
                }
            }
            categoryStructure.set(i, group);
        }
    }
}
