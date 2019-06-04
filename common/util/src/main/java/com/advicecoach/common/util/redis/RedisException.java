package com.advicecoach.common.util.redis;

/**
 * Created by nan on 10/8/2016.
 */
public class RedisException extends Exception {
    public RedisException(String err) {
        super(err);
    }

    public RedisException(String err, Exception e) {
        super(err, e);
    }
}
