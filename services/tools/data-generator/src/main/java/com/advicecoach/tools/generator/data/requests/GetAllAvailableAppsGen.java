package com.advicecoach.tools.generator.data.requests;

import com.advicecoach.common.api.mobile.msg.GetAllAvailableAppsReq;
import com.advicecoach.tools.generator.data.template.BaseGenerator;
import org.junit.Test;

/**
 * Created by nan on 1/21/2017.
 */
public class GetAllAvailableAppsGen extends BaseGenerator {
    @Test
    public void testReq() {
        GetAllAvailableAppsReq req = new GetAllAvailableAppsReq();
        req.setUserId(1);

        gen(req);
    }
}
