package com.advicecoach.services.report.impl.modules;

import com.advicecoach.common.api.report.msg.UserLoginReq;
import com.advicecoach.common.api.report.msg.UserLoginResp;
import com.advicecoach.services.report.impl.data.DatabaseAccess;
import lombok.extern.slf4j.Slf4j;

import java.math.BigInteger;
import java.security.MessageDigest;

/**
 * Created by nan on 3/22/2017.
 */
@Slf4j
public class LoginProcessor {
    private DatabaseAccess db;

    public LoginProcessor setDb(DatabaseAccess db) {
        this.db = db;
        return this;
    }

    public UserLoginResp processUserLogin(UserLoginReq req) throws Exception {
        // TODO user login
        return null;
    }

    public String hashPassword(String pw) {
        String strPw = "";
        if (pw != null) {
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                md.update(pw.getBytes("UTF-8"));
                byte[] digest = md.digest();
                strPw = String.format("%064x", new BigInteger(1, digest));
            } catch (Exception e) {
                log.error("Error generating password hash: " + e.getMessage(), e);
            }
        }
        return strPw;
    }
}
