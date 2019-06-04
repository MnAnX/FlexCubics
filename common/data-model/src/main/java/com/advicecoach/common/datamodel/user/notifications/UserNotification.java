package com.advicecoach.common.datamodel.user.notifications;

import lombok.Data;

/**
 * Created by Nan on 8/21/2017.
 */
@Data
public class UserNotification {
    private Long id;
    private String title;
    private String content;
    private String sender;
    private String time;
    private boolean hasRead;
    private Boolean allowReply;
    private Integer senderUserId;
    private String imageUrl;
    private String videoUrl;
}
