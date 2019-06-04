package com.advicecoach.services.notification;

import com.advicecoach.services.notification.scheduler.EventScheduler;
import com.google.inject.Guice;
import com.google.inject.Inject;
import com.google.inject.Injector;

/**
 * Created by nanxiao on 9/5/16.
 */
public class NotificationServiceRunner {
    final Injector injector;

    @Inject
    public NotificationServiceRunner(final Injector injector) {
        this.injector = injector;
    }

    public void start() {
        EventScheduler server = injector.getInstance(EventScheduler.class);
        server.startAsync();
    }

    public static void main(final String[] args) {
        Guice.createInjector(new NotificationServiceModule())
                .getInstance(NotificationServiceRunner.class)
                .start();
    }
}
