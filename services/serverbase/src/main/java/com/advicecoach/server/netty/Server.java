package com.advicecoach.server.netty;

/**
 * Created by nanxiao on 9/3/16.
 */
public interface Server {
    void start() throws ServerException;

    void shutdown();
}