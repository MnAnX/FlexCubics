package com.advicecoach.common.datamodel.library;

import lombok.Data;

@Data
public class ContentContainer {
    private Integer id;

    private String name;
    private String description;

    // content attributes
    private String text;
    private String imageUrl;
    private String videoUrl;

    // For PT
    private String numRepetitions;
    private String numSets;
    private String intensity;
    private String frequency;
    private String duration;
}
