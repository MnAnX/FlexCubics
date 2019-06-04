package com.advicecoach.tools.generator.data.survey;

import com.advicecoach.common.datamodel.survey.Survey;
import com.advicecoach.tools.generator.data.template.BaseGenerator;
import org.junit.Test;

/**
 * Created by nan on 2/19/2017.
 */
public class SurveyGen extends BaseGenerator {
    @Test
    public void testGen() {
        Survey survey = new Survey();
        survey.setName("Feature Survey");
        survey.setTitle("Quick Question:");
        survey.setContent("Which features would you use?");
        survey
                .addOption(1, "Private chat with other readers")
                .addOption(2, "Forum for Tips")
                .addOption(3, "Ask the Author")
                .addOption(4, "Invite friends to a private chat group");

        gen(survey);
    }
}
