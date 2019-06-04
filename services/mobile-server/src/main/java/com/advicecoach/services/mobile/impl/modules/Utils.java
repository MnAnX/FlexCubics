package com.advicecoach.services.mobile.impl.modules;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class Utils {
    private DateTimeFormatter dtFormatter;

    public Utils() {
        dtFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mma");
    }

    public String getCurrentUtcTime() {
        ZonedDateTime zonedTime = ZonedDateTime.now(ZoneId.of("Z"));
        String formattedTime = zonedTime.format(dtFormatter);

        return formattedTime;
    }
}
