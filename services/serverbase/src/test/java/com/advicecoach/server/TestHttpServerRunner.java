package com.advicecoach.server;

import com.advicecoach.server.netty.http.HttpServer;
import com.advicecoach.server.netty.Server;
import com.google.inject.Guice;
import com.google.inject.Inject;
import com.google.inject.Injector;

/**
 * Created by nanxiao on 9/5/16.
 */
public class TestHttpServerRunner {
    final Injector injector;

    @Inject
    public TestHttpServerRunner(final Injector injector) {
        this.injector = injector;
    }

    public void start() {
        Server server = injector.getInstance(HttpServer.class);
        server.start();
    }

    public static void main(final String[] args) {
        Guice.createInjector(new TestHttpServerModule())
                .getInstance(TestHttpServerRunner.class)
                .start();
    }
}
