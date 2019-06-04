package com.advicecoach.common.util.config;

import com.typesafe.config.Config;

/**
 * Created by nan on 10/8/2016.
 */
public class MySqlConfig {
    private final Config conf;

    public MySqlConfig(final Config root) {
        this.conf = root.getConfig("mysql.config");
    }

    public MySqlConfig(final Config root, final String path) {
        this.conf = root.getConfig(path);
    }

    public String host() {
        return conf.getString("host");
    }

    public int port() {
        return conf.getInt("port");
    }

    public String schema() {
        return conf.getString("schema");
    }

    public String user() {
        return conf.getString("user");
    }

    public String password() {
        return conf.getString("pw");
    }
}
