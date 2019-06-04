package com.advicecoach.tools.generator.data.template.generators;

import com.advicecoach.common.datamodel.app.template.AppCategory;
import com.advicecoach.common.datamodel.app.template.AppCategoryGroup;
import com.advicecoach.common.datamodel.app.template.AppStep;
import com.google.api.client.util.Lists;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Stream;

/**
 * Created by nan on 3/26/2017.
 */
public class StructureLoader {
    private final String filePath;

    public StructureLoader(String filePath) {
        this.filePath = filePath;
    }

    public List<AppCategoryGroup> importStructure() throws Exception {
        List<AppCategoryGroup> groups = Lists.newArrayList();
        try (Stream<String> stream = Files.lines(Paths.get(filePath))) {
            AppCategoryGroup currentGroup = null;
            AppCategory currentCategory = null;
            Iterator<String> it = stream.iterator();
            while (it.hasNext()) {
                String line = it.next();
                if (line.isEmpty()) {
                    continue;
                }
                if (!line.startsWith("\t")) {
                    // There is NO TAB at the line beginning
                    // New group starts
                    // init the new group
                    currentGroup = buildNewGroup(line);
                    groups.add(currentGroup);
                } else if (line.startsWith("\t\t")) {
                    // There are TWO TABS at the beginning
                    // is a step
                    // add the step to the current category
                    currentCategory.addStep(buildNewStep(line));
                } else if (line.startsWith("\t")) {
                    // There is ONE TAB at the beginning
                    // New category starts
                    // init the new category
                    currentCategory = buildNewCategory(line);
                    currentCategory.setGroupName(currentGroup.getName());
                    // add to current group
                    currentGroup.addCategory(currentCategory);
                }
            }
        }
        return groups;
    }

    private AppCategory buildNewCategory(String line) throws Exception {
        line = line.trim();
        AppCategory category = new AppCategory();
        int idxSeparator = line.indexOf(".");
        if (idxSeparator < 1) {
            throw new Exception("Invalid format of the category: " + line);
        }
        String id = line.substring(0, idxSeparator).trim();
        String nameDesc = line.substring(idxSeparator + 1).trim();
        category.setId(id);
        if (nameDesc.contains(":")) {
            String[] contents = nameDesc.split(":");
            String name = contents[0].trim();
            String desc = contents[1].trim();
            category.setName(name);
            category.setDescription(desc);
        } else {
            category.setName(nameDesc);
        }
        return category;
    }

    private AppCategoryGroup buildNewGroup(String line) throws Exception {
        line = line.trim();
        AppCategoryGroup group = new AppCategoryGroup();
        int idxSeparator = line.indexOf(".");
        if (idxSeparator < 1) {
            throw new Exception("Invalid format of the group: " + line);
        }
        String id = line.substring(0, idxSeparator).trim();
        String name = line.substring(idxSeparator + 1).trim();
        group.setId(id);
        group.setName(name);
        return group;
    }

    private AppStep buildNewStep(String line) throws Exception {
        line = line.trim();
        // init the step
        int idxSeparator = line.indexOf(".");
        if (idxSeparator < 1) {
            throw new Exception("Invalid format of the step: " + line);
        }
        String strIndex = line.substring(0, idxSeparator).trim();

        String p2 = line.substring(idxSeparator + 1).trim();
        int idxEstSeparator = p2.indexOf("]");
        String estTime = null;
        String stepName = null;
        if (idxEstSeparator < 1) {
            stepName = p2.trim();
        } else {
            estTime = p2.substring(1, idxEstSeparator).trim();
            stepName = p2.substring(idxEstSeparator + 1).trim();
        }
        // get the step number and content
        int index;
        try {
            index = Integer.valueOf(strIndex);
        } catch (Exception e) {
            throw new Exception("Invalid index format: " + strIndex + ", of the step: " + line);
        }
        // build the step
        AppStep step = new AppStep();
        step.setIndex(index);
        step.setEstimatedTime(estTime);
        step.setName(stepName);

        return step;
    }
}
