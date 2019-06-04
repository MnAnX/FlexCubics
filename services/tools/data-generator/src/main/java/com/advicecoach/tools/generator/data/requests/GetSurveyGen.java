package com.advicecoach.tools.generator.data.requests;

import com.advicecoach.common.api.mobile.msg.GetSurveyReq;
import com.advicecoach.tools.generator.data.template.BaseGenerator;
import org.junit.Test;

/**
 * Created by nan on 2/20/2017.
 */
public class GetSurveyGen extends BaseGenerator {
    @Test
    public void testReq() {
        GetSurveyReq req = new GetSurveyReq();
        req.setUserId(1);
        gen(req);
    }
}
