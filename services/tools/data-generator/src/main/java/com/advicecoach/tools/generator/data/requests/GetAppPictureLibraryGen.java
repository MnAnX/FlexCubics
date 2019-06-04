package com.advicecoach.tools.generator.data.requests;

import com.advicecoach.common.api.mobile.msg.GetAppPictureLibraryReq;
import com.advicecoach.common.datamodel.app.template.AppPictureLibrary;
import com.advicecoach.tools.generator.data.template.BaseGenerator;
import org.junit.Test;

/**
 * Created by nan on 1/23/2017.
 */
public class GetAppPictureLibraryGen extends BaseGenerator {
    @Test
    public void testReq() {
        GetAppPictureLibraryReq req = new GetAppPictureLibraryReq();
        req.setAppId(1);
        req.setType(AppPictureLibrary.LibraryType.Motivation);

        gen(req);
    }
}