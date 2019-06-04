package com.advicecoach.tools.generator.data.template;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import junit.framework.TestCase;
import org.junit.Before;

/**
 * Created by nan on 1/21/2017.
 */
public class BaseGenerator extends TestCase {
    Gson gson;

    @Before
    public void setUp(){
        gson = new GsonBuilder().create();
    }

    public <T> void gen(T object){
        System.out.println(gson.toJson(object));
    }
}
