package com.advicecoach.common.datamodel.user.notes;

import lombok.Data;

/**
 * Created by Nan on 8/21/2017.
 */
@Data
public class UserNote {
    private Long id;
    private String time;
    private String title;
    private String content;
}
