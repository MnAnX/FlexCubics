package com.advicecoach.server;

import com.advicecoach.server.netty.http.HttpServer;
import com.advicecoach.server.netty.http.responder.DefaultHttpResponder;
import com.advicecoach.server.netty.http.responder.HttpResponder;
import com.advicecoach.server.netty.ServerPort;
import com.google.inject.AbstractModule;
import com.google.inject.name.Names;

/**
 * Created by nanxiao on 9/5/16.
 */

public class TestHttpServerModule extends AbstractModule {
    @Override
    protected void configure() {
        bind(HttpResponder.class).to(DefaultHttpResponder.class);
        bind(Integer.class).annotatedWith(Names.named(HttpServer.LISTEN_PORT_NAME))
                .toInstance(ServerPort.PortNumber.HTTP.value());
    }
}