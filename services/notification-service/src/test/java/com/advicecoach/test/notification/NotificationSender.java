package com.advicecoach.test.notification;

import com.advicecoach.common.datamodel.custom.CustomApp;
import com.advicecoach.common.datamodel.custom.CustomCategory;
import com.advicecoach.common.datamodel.custom.CustomImage;
import com.advicecoach.common.datamodel.schedule.EventSchedule;
import com.advicecoach.common.datamodel.schedule.ScheduleTime;
import com.advicecoach.common.datamodel.schedule.ScheduleType;
import com.advicecoach.common.datamodel.schedule.ZoneDateTime;
import com.advicecoach.common.datamodel.schedule.eventdata.AmPmCheckInSchedule;
import com.advicecoach.common.util.config.MySqlConfig;
import com.advicecoach.common.util.mysql.MySqlConnectorFactory;
import com.advicecoach.services.notification.data.OneSignalNotification;
import com.advicecoach.services.notification.scheduler.DatabaseAccess;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.internal.LinkedTreeMap;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Scanner;

/**
 * Created by nan on 2/20/2017.
 */
public class NotificationSender {
    public static final int EVENT_OFFSET = 20;
    static Integer USER_ID = 339;

    public static void main(String[] args) throws Exception {
        NotificationSender s = new NotificationSender();
        //s.sendAmCheckInNotification(USER_ID);
        s.sendEventNotification(USER_ID);
        //s.sendPmCheckInNotification(USER_ID);
    }

    Gson gson = new GsonBuilder().create();
    DatabaseAccess da;

    public NotificationSender(){
        Config rootConfig = ConfigFactory.load();
        MySqlConfig mysqlConf = new MySqlConfig(rootConfig);
        MySqlConnectorFactory f = new MySqlConnectorFactory(mysqlConf.host(), mysqlConf.port(), "advicecoach", mysqlConf.user(), mysqlConf.password());
        da = new DatabaseAccess(f);
    }

    public void sendEventNotification(Integer userId) throws Exception {
        EventSchedule schedule = loadSchedule(userId);
        LinkedTreeMap sd = (LinkedTreeMap)schedule.getScheduleData();
        Double customAppId = (Double) sd.get("customAppId");
        String categoryId = (String) sd.get("categoryId");
        CustomApp customApp = da.getCustomAppById(customAppId.intValue());
        CustomCategory category = customApp.getCategory(categoryId);
        String imageUrl = category.getMotivation().getBeforePicture().getImageUrl();
        sendNotification(userId, schedule, imageUrl);
    }

    private EventSchedule loadSchedule(Integer userId) throws Exception {
        List<EventSchedule> events = da.getUserSchedules(userId);
        return events.get(EVENT_OFFSET);
    }

    public void sendAmCheckInNotification(Integer userId) throws IOException {
        //CategoryStepEventSchedule event = new CategoryStepEventSchedule();
        AmPmCheckInSchedule event = new AmPmCheckInSchedule();
        //SetupCategorySchedule event = new SetupCategorySchedule();
        event.setCustomAppId(237);
        event.setCategoryId("T101:G1:C4");
        //event.setStepIndex(2);
        CustomImage img = new CustomImage();
        img.setImageUrl("https://i.imgsafe.org/a47d4097ff.jpeg");

        //EventSchedule<CategoryStepEventSchedule> schedule = new EventSchedule<>();
        //schedule.setType(ScheduleType.Event_CategoryStep);
        EventSchedule<AmPmCheckInSchedule> schedule = new EventSchedule<>();
        schedule.setType(ScheduleType.Event_AmCheckIn);
        //EventSchedule<SetupCategorySchedule> schedule = new EventSchedule<>();
        //schedule.setType(ScheduleType.Reminder_SetupCategory);
        ScheduleTime time = new ScheduleTime();
        ZoneDateTime zdt = new ZoneDateTime();
        zdt.setUtcTime(LocalDateTime.now());
        zdt.setTimezone(0);
        time.setStartTime(zdt);
        schedule.setScheduleTime(time);
        schedule.setScheduleData(event);

        sendNotification(userId, schedule, "https://i.imgsafe.org/a47d4097ff.jpeg");
    }

    public void sendPmCheckInNotification(Integer userId) throws IOException {
        //CategoryStepEventSchedule event = new CategoryStepEventSchedule();
        AmPmCheckInSchedule event = new AmPmCheckInSchedule();
        //SetupCategorySchedule event = new SetupCategorySchedule();
        event.setCustomAppId(237);
        event.setCategoryId("T101:G4:C1");
        //event.setStepIndex(2);
        CustomImage img = new CustomImage();
        img.setImageUrl("https://i.imgsafe.org/a53d931e26.jpg");

        //EventSchedule<CategoryStepEventSchedule> schedule = new EventSchedule<>();
        //schedule.setType(ScheduleType.Event_CategoryStep);
        EventSchedule<AmPmCheckInSchedule> schedule = new EventSchedule<>();
        schedule.setType(ScheduleType.Event_PmCheckIn);
        //EventSchedule<SetupCategorySchedule> schedule = new EventSchedule<>();
        //schedule.setType(ScheduleType.Reminder_SetupCategory);
        ScheduleTime time = new ScheduleTime();
        ZoneDateTime zdt = new ZoneDateTime();
        zdt.setUtcTime(LocalDateTime.now());
        zdt.setTimezone(0);
        time.setStartTime(zdt);
        schedule.setScheduleTime(time);
        schedule.setScheduleData(event);

        sendNotification(userId, schedule, "https://i.imgsafe.org/a53d931e26.jpg");
    }

    private <T> void sendNotification(Integer userId, EventSchedule<T> schedule, String imgLink) throws IOException {
        String jsonResponse;

        URL url = new URL("https://onesignal.com/api/v1/notifications");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setUseCaches(false);
        con.setDoOutput(true);
        con.setDoInput(true);

        con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        con.setRequestProperty("Authorization", "Basic MmQ0ZWJhNWYtY2JlYS00ODk0LWE2NDgtZGZlNmMwNTJiODIy");
        con.setRequestMethod("POST");

        OneSignalNotification notf = new OneSignalNotification();
        notf.setApp_id("e0ed93e9-2c4e-4dcd-8164-01e2be5cfaab");
        //notf.addIncludedSegments("All");
        notf.addTagFilter("user_id", String.valueOf(userId));
        notf.addData("user_id", String.valueOf(userId));
        notf.addData("type", schedule.getType().name());
        notf.addData("json", gson.toJson(schedule.getScheduleData()));
        notf.addData("img", imgLink);
        notf.addHeading("Time to do it!");
        //notf.addHeading("Time to setup the category");
        notf.addContent("test notification");
        //notf.addContent(event.getAppName() + " - " + event.getCategoryName());
        //notf.addIosAttachment("img", imgLink);

        String strJsonBody = gson.toJson(notf);

        System.out.println("strJsonBody:\n" + strJsonBody);

        byte[] sendBytes = strJsonBody.getBytes("UTF-8");
        con.setFixedLengthStreamingMode(sendBytes.length);

        OutputStream outputStream = con.getOutputStream();
        outputStream.write(sendBytes);

        int httpResponse = con.getResponseCode();
        System.out.println("httpResponse: " + httpResponse);

        if (httpResponse >= HttpURLConnection.HTTP_OK
                && httpResponse < HttpURLConnection.HTTP_BAD_REQUEST) {
            Scanner scanner = new Scanner(con.getInputStream(), "UTF-8");
            jsonResponse = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
            scanner.close();
        } else {
            Scanner scanner = new Scanner(con.getErrorStream(), "UTF-8");
            jsonResponse = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
            scanner.close();
        }
        System.out.println("jsonResponse:\n" + jsonResponse);
    }
}
