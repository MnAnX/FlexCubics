package com.advicecoach.common.datamodel.app.template;

import com.advicecoach.common.datamodel.data.Video;
import lombok.Data;

/**
 * Created by nan on 11/1/2016.
 */
@Data
public class AppStep {
    private Integer index = -1;
    private String name;
    private String estimatedTime;
    private Integer numRepetitions;
    private Video video;
    private String description;
}