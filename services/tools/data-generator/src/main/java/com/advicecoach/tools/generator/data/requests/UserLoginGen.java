package com.advicecoach.tools.generator.data.requests;

import com.advicecoach.common.api.mobile.msg.UserLoginReq;
import com.advicecoach.common.datamodel.user.UserInfo;
import com.advicecoach.tools.generator.data.template.BaseGenerator;
import org.junit.Test;

/**
 * Created by nan on 1/19/2017.
 */
public class UserLoginGen extends BaseGenerator {
    @Test
    public void testReq() {
        UserLoginReq req = new UserLoginReq();
        UserInfo info = new UserInfo();
        info.setEmail("nan.xiao@advicecoach.com");
        info.setFirstName("Nan");
        info.setLastName("Xiao");
        info.setLoginType("google");
        info.setProfilePhotoUrl("http://www.test.com/image");
        req.setUserInfo(info);

        gen(req);
    }
}
