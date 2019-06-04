package com.advicecoach.common.datamodel.data;

import com.google.common.collect.Lists;
import lombok.Data;

import java.util.List;

@Data
public class Goal {
    private Long id;
    private String goal;
    private String startTime;
    private String endTime;
    private List<Progress> progressList = Lists.newArrayList();
}
