package com.advicecoach.tools.generator.data.requests;

import com.advicecoach.common.api.mobile.msg.GetUserAppsReq;
import com.advicecoach.tools.generator.data.template.BaseGenerator;
import org.junit.Test;

/**
 * Created by nan on 1/21/2017.
 */
public class GetUserAppsGen extends BaseGenerator {
    @Test
    public void testReq() {
        GetUserAppsReq req = new GetUserAppsReq();
        req.setUserId(1);

        gen(req);
    }
}
