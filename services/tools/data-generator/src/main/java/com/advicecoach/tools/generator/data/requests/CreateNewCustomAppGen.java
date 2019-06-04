package com.advicecoach.tools.generator.data.requests;

import com.advicecoach.common.api.mobile.msg.CreateNewCustomAppReq;
import com.advicecoach.common.datamodel.custom.CustomApp;
import com.advicecoach.common.datamodel.custom.CustomCategory;
import com.advicecoach.common.datamodel.custom.CustomStep;
import com.advicecoach.tools.generator.data.template.BaseGenerator;
import org.junit.Test;

/**
 * Created by nan on 1/23/2017.
 */
public class CreateNewCustomAppGen extends BaseGenerator {
    @Test
    public void testReq() {
        CreateNewCustomAppReq req = new CreateNewCustomAppReq();
        req.setUserId(1);
        req.setAppId(1);

        // mock creating a new custom app
        CustomApp capp = new CustomApp();
/*
        // mock selected categories in order
        CustomCategory cat1 = new CustomCategory();
        cat1.setName("Learn about women's history");
        cat1.setStep(1, CustomStep.builder().index(1).name("Choose an issue that is vividly in the public eye today").estimatedTime("45 min").build());
        cat1.setStep(2, CustomStep.builder().index(2).name("Embrace the controversy surrounding the issue and make it into a platform for my opinions").estimatedTime("45 min").build());
        cat1.setStep(3, CustomStep.builder().index(3).name("Decide how I will express my opinions publicly and act").estimatedTime("45 min").build());
        cat1.setStep(4, CustomStep.builder().index(4).name("Write 5 bullet points of inspiration from what you learned, take a photo of that and add to your photo library").estimatedTime("45 min").build());

        CustomCategory cat2 = new CustomCategory();
        cat2.setName("Learn my own family's history");
        cat2.setStep(1, CustomStep.builder().index(1).name("Choose a female relative to interview").estimatedTime("45 min").build());
        cat2.setStep(2, CustomStep.builder().index(2).name("Schedule the interview").estimatedTime("45 min").build());
        cat2.setStep(3, CustomStep.builder().index(3).name("Write the questions I want to ask about their story and moments of resistance").estimatedTime("45 min").build());
        cat2.setStep(4, CustomStep.builder().index(4).name("Record the interview, write down the key takeaways to photograph and add to my library").estimatedTime("45 min").build());

        CustomCategory cat3 = new CustomCategory();
        cat3.setName("How I Will Set The Agenda");
        cat3.setStep(1, CustomStep.builder().index(1).name("Choose a meeting scheduled in the next few days where I can set the agenda").estimatedTime("45 min").build());
        cat3.setStep(2, CustomStep.builder().index(2).name("Prepare how I will set the agenda speaking with clarity to firmly express my point of view").estimatedTime("45 min").build());
        cat3.setStep(3, CustomStep.builder().index(3).name("Remember to make eye contact, smile, and sit up straight").estimatedTime("45 min").build());

        capp.setCategory("T101:G1:C1", cat1);
        capp.setCategory("T101:G1:C2", cat2);
        capp.setCategory("T101:G2:C2", cat3);

        req.setCustomApp(capp);

        gen(req);*/
    }
}
