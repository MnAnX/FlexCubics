package com.advicecoach.tools.generator.data.template;

import com.advicecoach.common.datamodel.app.AppInfo;
import com.advicecoach.common.datamodel.app.AppTemplate;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Created by nan on 1/22/2017.
 */
public class GenerateApp {
    static final String TEMPLATE_DIR = "K:\\AdviceCoach\\templates";

    static final String BOOK_NAME = "No Excuses";

    static final int APP_ID = 1;

    public static void main(String[] args) throws Exception {
        Gson gson = new GsonBuilder().create();
        AppGenerator generator = new AppGenerator(TEMPLATE_DIR, BOOK_NAME);
        AppInfo appInfo = generator.genAppInfo(APP_ID);
        AppTemplate appTemplate = generator.genAppTemplate();
        System.out.println("App Info:");
        System.out.println(gson.toJson(appInfo));
        System.out.println("App Template:");
        System.out.println(gson.toJson(appTemplate));
    }
}
