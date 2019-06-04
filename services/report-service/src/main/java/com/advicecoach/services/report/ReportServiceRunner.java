package com.advicecoach.services.report;

import com.advicecoach.server.netty.Server;
import com.advicecoach.server.netty.ServerException;
import com.advicecoach.server.netty.http.HttpServer;
import com.google.inject.Guice;
import com.google.inject.Inject;
import com.google.inject.Injector;

/**
 * Created by nanxiao on 9/5/16.
 */
public class ReportServiceRunner {
    final Injector injector;

    @Inject
    public ReportServiceRunner(final Injector injector) {
        this.injector = injector;
    }

    public void start() throws ServerException {
        Server server = injector.getInstance(HttpServer.class);
        server.start();
    }

    public static void main(final String[] args) throws ServerException {
        Guice.createInjector(new ReportServiceModule())
                .getInstance(ReportServiceRunner.class)
                .start();
    }
}
