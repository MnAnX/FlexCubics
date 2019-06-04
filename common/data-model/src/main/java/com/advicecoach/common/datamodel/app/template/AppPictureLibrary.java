package com.advicecoach.common.datamodel.app.template;

import com.google.common.collect.Lists;
import lombok.Data;

import java.util.List;

/**
 * Created by nan on 1/2/2017.
 */
@Data
public class AppPictureLibrary {
    public enum LibraryType {
        Motivation,
        Achievement;

        public boolean in(LibraryType... types){
            for(LibraryType t : types){
                if(this == t){
                    return true;
                }
            }
            return false;
        }
    }

    private LibraryType type;
    private String name;
    private String description;
    private List<String> pictureUrls = Lists.newArrayList();

    public AppPictureLibrary(LibraryType type) {
        this.type = type;
    }

    public boolean isEmpty() {
        return pictureUrls == null || pictureUrls.isEmpty();
    }
}
