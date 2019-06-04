package com.advicecoach.common.util.config;

import com.typesafe.config.Config;

/**
 * Created by nan on 10/8/2016.
 */
public class RedisConfig {
    private final Config conf;

    public RedisConfig(final Config root) {
        this.conf = root.getConfig("redis.config");
    }

    public String host() {
        return conf.getString("host");
    }

    public int port() {
        return conf.getInt("port");
    }

    public int db(String name) {
        return conf.getInt("db." + name);
    }
}
