package com.advicecoach.services.notification.scheduler.tmp;

import com.advicecoach.common.datamodel.user.UserSchedule;
import com.advicecoach.common.util.mysql.MySqlConnectorFactory;
import com.advicecoach.common.util.mysql.MySqlDataConnector;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;

/**
 * Created by nan on 10/2/2016.
 */
@Slf4j
public class ScheduleDataAccess extends MySqlDataConnector {
    private static final String SQL_REMINDER = "SELECT * FROM schedules WHERE id = ?";
    private Gson gson;

    @Inject
    public ScheduleDataAccess(final MySqlConnectorFactory connFactory) {
        super(connFactory);
        gson = new GsonBuilder().create();
    }

    public UserSchedule getSchedule(int id) throws Exception {
        log.debug("Getting schedule by ID [{}]", id);
        return executeQuery(SQL_REMINDER,
                st -> st.setInt(1, id),
                res -> {
                    if (res.next()) {
                        String scheduleStr = res.getString("schedule_object");
                        log.trace("Schedule found for ID [{}]: {}", id, scheduleStr);
                        UserSchedule schedule;
                        try {
                            schedule = gson.fromJson(scheduleStr, UserSchedule.class);
                        } catch (JsonSyntaxException e) {
                            throw new DataNotFoundException("Malformed schedule data for id [" + id + "]: " + scheduleStr);
                        }
                        if (scheduleStr.isEmpty() || schedule == null) {
                            throw new DataNotFoundException("Malformed schedule data for id [" + id + "]: empty");
                        }
                        return schedule;
                    } else {
                        throw new DataNotFoundException("No schedule available for id [" + id + "]");
                    }
                });
    }
}
