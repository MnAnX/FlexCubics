package com.advicecoach.tools.generator.data.requests;

import com.advicecoach.common.api.mobile.msg.UpdateCustomCategoryImageReq;
import com.advicecoach.common.datamodel.custom.CustomImage;
import com.advicecoach.tools.generator.data.template.BaseGenerator;
import org.junit.Test;

/**
 * Created by nan on 1/23/2017.
 */
public class UpdateCustomCategoryImageGen extends BaseGenerator {
    @Test
    public void testReq() {
        UpdateCustomCategoryImageReq req = new UpdateCustomCategoryImageReq();
        req.setUserId(1);
        req.setCustomAppId(1);
        CustomImage image = new CustomImage();
        image.setName("nan_test_image");
        //image.setImageType(CustomImage.ImageType.BeforePicture);
        //image.setDataType(CustomImage.DataType.Raw);
        //req.setImage(image);

        gen(req);
    }
}