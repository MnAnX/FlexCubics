package com.advicecoach.common.datamodel.user.notes;

import com.google.common.collect.Maps;
import lombok.Data;

import java.util.HashMap;

/**
 * Created by Nan on 8/21/2017.
 */
@Data
public class UserNotes {
    private Integer userId;
    private HashMap<Long, UserNote> notes = Maps.newHashMap();
}
