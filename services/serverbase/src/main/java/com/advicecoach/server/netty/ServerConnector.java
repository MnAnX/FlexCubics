package com.advicecoach.server.netty;

import io.netty.channel.ChannelInitializer;

/**
 * Created by nanxiao on 9/3/16.
 */
public interface ServerConnector {
    int getPort();

    ChannelInitializer<?> getChannelInitializer();
}