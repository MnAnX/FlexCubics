package com.advicecoach.services.communication;

import com.advicecoach.server.netty.Server;
import com.advicecoach.server.netty.ServerException;
import com.advicecoach.server.netty.http.HttpServer;
import com.google.inject.Guice;
import com.google.inject.Inject;
import com.google.inject.Injector;

public class CommunicationServiceRunner {
    final Injector injector;

    @Inject
    public CommunicationServiceRunner(final Injector injector) {
        this.injector = injector;
    }

    public void start() throws ServerException {
        Server server = injector.getInstance(HttpServer.class);
        server.start();
    }

    public static void main(final String[] args) throws ServerException {
        Guice.createInjector(new CommunicationServiceModule())
                .getInstance(CommunicationServiceRunner.class)
                .start();
    }
}
