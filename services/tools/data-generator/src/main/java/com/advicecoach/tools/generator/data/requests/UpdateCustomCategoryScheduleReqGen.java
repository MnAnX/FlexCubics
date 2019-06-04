package com.advicecoach.tools.generator.data.requests;

import com.advicecoach.common.api.mobile.msg.UpdateCustomCategoryScheduleReq;
import com.advicecoach.common.datamodel.schedule.ScheduleTime;
import com.advicecoach.tools.generator.data.template.BaseGenerator;
import org.junit.Test;

/**
 * Created by nan on 2/12/2017.
 */
public class UpdateCustomCategoryScheduleReqGen extends BaseGenerator {
    @Test
    public void testReq() {
        UpdateCustomCategoryScheduleReq req = new UpdateCustomCategoryScheduleReq();
        req.setCustomAppId(1);
        req.setCategoryId("T101:G1:C1");
        req.setStepIndex(1);
        ScheduleTime time = new ScheduleTime();
        //time.setStartTime(LocalDateTime.now(ZoneId.of("Z")));
        req.setScheduleTime(time);

        gen(req);
    }
}