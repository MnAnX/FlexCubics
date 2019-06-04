package com.advicecoach.services.mobile.impl.modules;

import com.advicecoach.common.datamodel.user.notes.UserNote;
import com.advicecoach.common.datamodel.user.notes.UserNotes;

/**
 * Created by Nan on 8/21/2017.
 */
public class UserNotesProcessor {
    private final Utils utils;

    public UserNotesProcessor() {
        utils = new Utils();
    }

    public UserNotes addNote(UserNotes userNotes, UserNote newNote) {
        long newId = System.currentTimeMillis(); // user timestamp as note id
        newNote.setId(newId);
        newNote.setTime(utils.getCurrentUtcTime());
        userNotes.getNotes().put(newId, newNote);
        return userNotes;
    }

    public UserNotes removeNote(UserNotes userNotes, Long noteId) {
        userNotes.getNotes().remove(noteId);
        return userNotes;
    }

    public UserNotes updateNote(UserNotes userNotes, Long noteId, UserNote updatedNote) {
        if (userNotes.getNotes().containsKey(noteId)) {
            updatedNote.setTime(utils.getCurrentUtcTime());
            userNotes.getNotes().put(noteId, updatedNote);
        }
        return userNotes;
    }
}
