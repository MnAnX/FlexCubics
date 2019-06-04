package com.advicecoach.services.notification.scheduler.tmp;

import com.advicecoach.common.datamodel.user.UserSchedule;
import com.advicecoach.common.util.redis.RedisConnector;
import com.advicecoach.common.util.redis.RedisException;
import com.google.common.util.concurrent.AbstractExecutionThreadService;
import com.google.inject.Inject;
import lombok.extern.slf4j.Slf4j;
import redis.clients.jedis.Tuple;

/**
 * Created by nan on 10/17/2016.
 */
@Slf4j
public class ScheduleReminderProcessor extends AbstractExecutionThreadService {
    /*
    * Schedules are stored in Redis as sorted list;
    * Schedule the next recurring event (on the series) after consumed the current one.
    * Sleep/wait for min(fixed period (e.g. 1 min), delta to next scheduled event).
    * */

    //private static final long CHECK_INTERVAL = 60000; //1 min
    private static final long CHECK_INTERVAL = 5000; //5 secs
    public static final int MILLI_SECS_PER_DAY = 86400000;
    private static final String KEYSPACE = "reminders";
    private final RedisConnector redis;
    private final ScheduleDataAccess mysql;

    @Inject
    public ScheduleReminderProcessor(final RedisConnector redis, final ScheduleDataAccess mysql) throws Exception {
        this.redis = redis;
        this.mysql = mysql;
        try {
            redis.connect();
        } catch (RedisException e) {
            throw new Exception("Unable to connect to redis. Reason: " + e.getMessage(), e);
        }
    }

    @Override
    protected void run() throws Exception {
        Thread.currentThread().setName(this.getClass().getSimpleName());
        log.debug(Thread.currentThread().getName() + " starts running");
        while (isRunning()) {
            process();
        }
    }

    private void process() {
        try {
            // If nothing in notification queue, check periodically
            try {
                if (redis.zcard(KEYSPACE) < 1) {
                    log.trace("Checking schedule");  // temp
                    sleepFixedInterval();
                    return;
                }
            } catch (RedisException e) {
                onError("Error connecting to Redis: " + e.getMessage(), e);
                return;
            }

            /*
            * When there are scheduled reminder events in the queue,
            * periodically check the head event, until it's triggered.
            * */
            Tuple reminderObject;
            try {
                reminderObject = redis.zpeekWithScore(KEYSPACE);
            } catch (RedisException e) {
                onError("Error connecting to Redis: " + e.getMessage(), e);
                return;
            }

            String scheduleIdStr = reminderObject.getElement();
            int scheduleId;
            try {
                scheduleId = Integer.valueOf(scheduleIdStr);
            } catch (NumberFormatException e) {
                onError("Malformed reminder ID: " + scheduleIdStr);
                return;
            }
            long scheduledTime = (long) reminderObject.getScore();
            log.trace("Head schedule: id={}, time={}", scheduleId, scheduledTime);

            // Validate scheduled time
            if (scheduledTime < 1) {
                // Invalid scheduled time. Log error and discard.
                discardHeadReminder();
                onError("Error: Invalid scheduled time of event [" + scheduleId + "]: " + scheduledTime);
                return;
            }

            /*
            * Check timestamp of the head event.
            * If time is not up for the next event, determine sleep time till the next check.
            * Otherwise, if time is up, trigger the event.
            * */
            if (scheduledTime > System.currentTimeMillis()) {
                /*
                * Time not up for the current next event yet.
                * Sleep for a smaller period in between the next scheduled event and the check interval,
                * so we can handle the case if there's a new event comes in front of the current head.
                * */
                long nextSleep = Math.min((scheduledTime - System.currentTimeMillis()), CHECK_INTERVAL);
                sleep(nextSleep);
                return;
            } else {
                /*
                * Time is up for the first event. Trigger it.
                * */
                // Pop out this event
                discardHeadReminder();
                // Process it
                processReminder(scheduleId, scheduledTime);
            }
        } catch (Exception e) {
            onError("Error processing: " + e.getMessage(), e);
            return;
        }
    }

    private void processReminder(int scheduleId, long scheduledTime) throws Exception {
        /*
        * Send reminder.
        * If it is recurring and not ended, schedule the following event.
        * */
        // Get schedule detail
        UserSchedule schedule = mysql.getSchedule(scheduleId);
        log.info("Processing schedule [{}]: {}", scheduleId, schedule.toString());

        // TODO: Send reminder (Amazon SNS)

        // Schedule next recurring event of the series
        scheduleNextRecurringEvent(scheduleId, scheduledTime, schedule);
    }

    private void scheduleNextRecurringEvent(int scheduleId, long scheduledTime, UserSchedule schedule) {
        /*
        if (schedule.getFrequency() > 0) {
            long nextScheduledTime = scheduledTime + (schedule.getFrequency() * MILLI_SECS_PER_DAY);
            if (nextScheduledTime <= (schedule.getEndDateTime().toEpochSecond(ZoneOffset.UTC) * 1000)) {
                // Next event still in range. Schedule it.
                // Insert event to Redis
                try {
                    redis.zadd(KEYSPACE, String.valueOf(scheduleId), nextScheduledTime);
                } catch (RedisException e) {
                    log.error("Failed to schedule the next event of schedule [{}]. Reason: {}", scheduleId, e.getMessage(), e);
                }
            }
        }
        */
    }

    private void discardHeadReminder() throws RedisException {
        redis.zlpop(KEYSPACE);
    }

    private void onError(String err) {
        onError(err, null);
    }

    private void onError(String err, Exception e) {
        if (e == null) {
            log.error(err);
        } else {
            log.error(err, e);
        }
        sleepFixedInterval();
    }

    private void sleepFixedInterval() {
        sleep(CHECK_INTERVAL);
    }

    private void sleep(long interval) {
        try {
            Thread.sleep(interval);
        } catch (InterruptedException e) {
            //
        }
    }
}
