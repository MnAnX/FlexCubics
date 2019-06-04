package com.advicecoach.common.api.mobile.msg;

import com.advicecoach.common.datamodel.user.notes.UserNote;
import lombok.Data;

import java.util.Collection;

/**
 * Created by Nan on 8/21/2017.
 */
@Data
public class GetUserNotesResp {
    private Collection<UserNote> notes;
}
