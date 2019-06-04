package com.advicecoach.common.api.mobile.msg;

import com.advicecoach.common.datamodel.user.notes.UserNote;
import lombok.Data;

/**
 * Created by Nan on 8/21/2017.
 */
@Data
public class AddUserNoteReq {
    private Integer userId;
    private UserNote note;
}
