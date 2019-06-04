package com.advicecoach.tools.generator.data.requests;

import com.advicecoach.common.api.mobile.msg.SubmitSurveyReq;
import com.advicecoach.tools.generator.data.template.BaseGenerator;
import com.google.api.client.util.Lists;
import org.junit.Test;

import java.util.List;

/**
 * Created by nan on 2/20/2017.
 */
public class SubmitSurveyGen extends BaseGenerator {
    @Test
    public void testReq() {
        SubmitSurveyReq req = new SubmitSurveyReq();
        req.setUserId(1);
        req.setSurveyId(1);
        List<Integer> optionIds = Lists.newArrayList();
        optionIds.add(1);
        optionIds.add(3);
        req.setOptionIds(optionIds);
        gen(req);
    }
}
