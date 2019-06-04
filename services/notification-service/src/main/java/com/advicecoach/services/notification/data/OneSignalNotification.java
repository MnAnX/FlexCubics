package com.advicecoach.services.notification.data;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * Created by nan on 2/20/2017.
 */
@Data
public class OneSignalNotification {
    private String app_id;
    private List<String> included_segments = Lists.newArrayList();
    private Map<String, String> contents = Maps.newHashMap();
    private Map<String, String> headings = Maps.newHashMap();
    private Map<String, String> subtitle = Maps.newHashMap();
    private String template_id;

    private List<Filter> filters = Lists.newArrayList();
    private Map<String, String> data = Maps.newHashMap();

    private Map<String, String> ios_attachments;
    private List<Button> buttons;

    public void addIncludedSegments(String segment) {
        included_segments.add(segment);
    }

    public void addContent(String content) {
        contents.put("en", content);
    }

    public void addHeading(String heading) {
        headings.put("en", heading);
    }

    public void addSubtitle(String subtitle) {
        headings.put("en", subtitle);
    }

    public void addFilter(String field, String key, String relation, String value) {
        Filter f = new Filter();
        f.setField(field);
        f.setKey(key);
        f.setRelation(relation);
        f.setValue(value);
        filters.add(f);
    }

    public void addTagFilter(String key, String value) {
        Filter f = new Filter();
        f.setField("tag");
        f.setKey(key);
        f.setRelation("=");
        f.setValue(value);
        filters.add(f);
    }

    public void addButton(String id, String text) {
        if (buttons == null) {
            buttons = Lists.newArrayList();
        }
        Button b = new Button();
        b.setId(id);
        b.setText(text);
        buttons.add(b);
    }

    public void addData(String key, String value) {
        data.put(key, value);
    }

    public void addIosAttachment(String key, String value) {
        if (ios_attachments == null) {
            ios_attachments = Maps.newHashMap();
        }
        ios_attachments.put(key, value);
    }

    @Data
    public class Filter {
        private String field;
        private String key;
        private String relation;
        private String value;
    }

    @Data
    public class Button {
        private String id;
        private String text;
    }
}
