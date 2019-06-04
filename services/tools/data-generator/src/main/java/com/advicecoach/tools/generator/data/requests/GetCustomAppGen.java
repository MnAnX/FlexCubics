package com.advicecoach.tools.generator.data.requests;

import com.advicecoach.common.api.mobile.msg.GetCustomAppReq;
import com.advicecoach.tools.generator.data.template.BaseGenerator;
import org.junit.Test;

/**
 * Created by nan on 1/23/2017.
 */
public class GetCustomAppGen extends BaseGenerator {
    @Test
    public void testReq() {
        GetCustomAppReq req = new GetCustomAppReq();
        req.setCustomAppId(1);

        gen(req);
    }
}