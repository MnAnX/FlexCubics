package com.advicecoach.tools.generator.data.requests;

import com.advicecoach.common.api.mobile.msg.UpdateCustomCategoryStepStatusReq;
import com.advicecoach.common.datamodel.custom.CustomImage;
import com.advicecoach.common.datamodel.custom.CustomStep;
import com.advicecoach.tools.generator.data.template.BaseGenerator;
import org.junit.Test;

/**
 * Created by nan on 2/9/2017.
 */
public class UpdateCustomCategoryStepStatusGen extends BaseGenerator {
    @Test
    public void testReq() {
        UpdateCustomCategoryStepStatusReq req = new UpdateCustomCategoryStepStatusReq();
        req.setCustomAppId(21);
        req.setCategoryId("T101:G3:C3");
        req.setStepIndex(1);
        req.setStepStatus(CustomStep.Status.Complete);

        gen(req);
    }
}