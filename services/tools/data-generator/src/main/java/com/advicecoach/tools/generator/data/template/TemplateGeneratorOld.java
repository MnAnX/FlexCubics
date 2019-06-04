package com.advicecoach.tools.generator.data.template;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppTemplate;
import com.advicecoach.common.datamodel.app.template.AppCategory;
import com.advicecoach.common.datamodel.app.template.AppCategoryGroup;
import com.advicecoach.common.datamodel.app.template.AppPictureLibrary;
import com.advicecoach.common.datamodel.app.template.BasicTemplate;
import com.advicecoach.tools.generator.data.template.generators.StructureLoader;
import com.google.api.client.util.Maps;
import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.ListMultimap;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

/**
 * Created by nan on 1/22/2017.
 */
public class TemplateGeneratorOld {
    private static final String DEFINITION_FILE_NAME = "definition.txt";
    private static final String STRUCTURE_FILE_NAME = "structure.txt";
    private static final String ICONS_FILE_NAME = "icons.txt";
    private static final String MOTIVATION_PIC_FILE_NAME = "motivation-pictures.txt";
    private static final String ACHIEVEMENT_PIC_FILE_NAME = "achievement-pictures.txt";
    public static final String VALUE_SEPERATOR = "=";

    private final String configFilesPath;
    private final StructureLoader structureLoader;

    public TemplateGeneratorOld(final String configFilesBasePath, final String appName) {
        this.configFilesPath = configFilesBasePath + File.separator + appName + File.separator;
        structureLoader = new StructureLoader(configFilesPath + STRUCTURE_FILE_NAME);
    }

    public AppInfo genAppInfo(int appId) throws Exception {
        AppInfo.AppInfoBuilder info = AppInfo.builder();
        Map<String, String> definitions = importDefinitions(DEFINITION_FILE_NAME);
        String title = definitions.get("title");
        String author = definitions.get("author");
        String bookCoverUrl = definitions.get("Book Cover URL".toLowerCase());
        String authorPhotoUrl = definitions.get("Author Photo URL".toLowerCase());
        info.appId(appId)
                .name(title)
                .author(author)
                .coverUrl(bookCoverUrl)
                .authorPhotoUrl(authorPhotoUrl);
        return info.build();
    }

    public AppTemplate genTemplate() throws Exception {
        AppTemplate appTemplate = initAppTemplate(importDefinitions(DEFINITION_FILE_NAME));

        List<AppCategoryGroup> categoryStructure = structureLoader.importStructure();

        Map<String, Object> structureMap = indexStructure(categoryStructure);
        populateIcons(structureMap, importIcons(ICONS_FILE_NAME));
        populatePictures(structureMap, AppPictureLibrary.LibraryType.Motivation, importPictures(MOTIVATION_PIC_FILE_NAME));
        populatePictures(structureMap, AppPictureLibrary.LibraryType.Achievement, importPictures(ACHIEVEMENT_PIC_FILE_NAME));
        updateCategoryStructureWithStructureMap(structureMap, categoryStructure);

        BasicTemplate template = new BasicTemplate();
        template.setGroups(categoryStructure);
        appTemplate.setTemplate(template);

        return appTemplate;
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

    private AppTemplate initAppTemplate(Map<String, String> definitions) throws Exception {
        // populate AppTemplate with definitions
        AppTemplate appTemplate = new AppTemplate();

        // App ID (required)
        if (!definitions.containsKey("type id")) {
            throw new Exception("Missing Type ID");
        }
        String strTypeId = definitions.get("type id");
        int typeId = Integer.valueOf(strTypeId);
        appTemplate.setTypeId(typeId);

        // List Title (optional)
        String listTitle = "Categories";  // Default listTitle
        if (definitions.containsKey("list title")) {
            listTitle = definitions.get("list title");
        }
        appTemplate.setListTitle(listTitle);

        // On Boarding Screen URL (optional)
        if (definitions.containsKey("on boarding screen url")) {
            String onBoardingUrl = definitions.get("on boarding screen url");
            appTemplate.setOnBoardingScreenUrl(onBoardingUrl);
        }

        // Default image URL (optional)
        if (definitions.containsKey("default image url")) {
            String defaultImageUrl = definitions.get("default image url");
            appTemplate.setDefaultImageUrl(defaultImageUrl);
        }

        return appTemplate;
    }

    private Map<String, String> importDefinitions(String file) throws Exception {
        Map<String, String> fieldValueMap = Maps.newHashMap();
        String filePath = configFilesPath + file;
        try (Stream<String> stream = Files.lines(Paths.get(filePath))) {
            Iterator<String> it = stream.iterator();
            while (it.hasNext()) {
                String l = it.next();
                String[] elements = l.trim().split(VALUE_SEPERATOR);
                if (elements.length < 2) {
                    throw new Exception("Invalid definition: " + l);
                }
                String field = elements[0].trim().toLowerCase();
                String value = elements[1].trim();
                fieldValueMap.put(field, value);
            }
        }
        return fieldValueMap;
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

    private Map<String, String> importIcons(String file) throws Exception {
        Map<String, String> fieldValueMap = Maps.newHashMap();
        String filePath = configFilesPath + file;
        try (Stream<String> stream = Files.lines(Paths.get(filePath))) {
            Iterator<String> it = stream.iterator();
            while (it.hasNext()) {
                String l = it.next();
                if (l.isEmpty()) {
                    continue;
                }
                int idxSeparator = l.indexOf(VALUE_SEPERATOR);
                if (idxSeparator < 1) {
                    throw new Exception("Invalid icon format: " + l);
                }
                String field = l.substring(0, idxSeparator).trim();
                String value = l.substring(idxSeparator + 1).trim();
                fieldValueMap.put(field, value);
            }
        }
        return fieldValueMap;
    }

    private void populateIcons(Map<String, Object> structure, Map<String, String> icons) {
        structure.entrySet().forEach(e -> {
            if (icons.containsKey(e.getKey())) {
                String icon = icons.get(e.getKey());
                Object obj = e.getValue();
                if (obj instanceof AppCategoryGroup) {
                    // set icon on group
                    ((AppCategoryGroup) obj).setIconUrl(icon);
                }
            }
        });
    }

    private ListMultimap<String, String> importPictures(String file) throws Exception {
        ListMultimap<String, String> picListMap = ArrayListMultimap.create();
        String filePath = configFilesPath + file;
        try (Stream<String> stream = Files.lines(Paths.get(filePath))) {
            Iterator<String> it = stream.iterator();
            while (it.hasNext()) {
                String l = it.next();
                if (l.isEmpty()) {
                    continue;
                }
                int idxSeparator = l.indexOf(VALUE_SEPERATOR);
                if (idxSeparator < 1) {
                    throw new Exception("Invalid icon format: " + l);
                }
                String id = l.substring(0, idxSeparator).trim();
                String url = l.substring(idxSeparator + 1).trim();
                picListMap.put(id, url);
            }
        }
        return picListMap;
    }

    private void populatePictures(Map<String, Object> structure, AppPictureLibrary.LibraryType type, ListMultimap<String, String> pictures) {
        structure.entrySet().forEach(e -> {
            if (pictures.containsKey(e.getKey())) {
                List<String> pics = pictures.get(e.getKey());
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
}
