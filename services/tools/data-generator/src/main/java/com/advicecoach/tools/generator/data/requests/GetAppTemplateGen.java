package com.advicecoach.tools.generator.data.requests;

import com.advicecoach.common.api.mobile.msg.GetAppTemplateReq;
import com.advicecoach.tools.generator.data.template.BaseGenerator;
import org.junit.Test;

/**
 * Created by nan on 1/22/2017.
 */
public class GetAppTemplateGen extends BaseGenerator {
    @Test
    public void testReq() {
        GetAppTemplateReq req = new GetAppTemplateReq();
        req.setAppId(1);

        gen(req);
    }
}
