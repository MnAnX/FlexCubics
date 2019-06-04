package com.advicecoach.services.web.impl.modules;

import com.auth0.client.auth.AuthAPI;
import com.auth0.exception.APIException;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.auth.CreatedUser;
import com.auth0.net.SignUpRequest;
import com.google.inject.Inject;
import com.google.inject.name.Named;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.RandomStringUtils;

import java.util.HashMap;
import java.util.Map;


@Slf4j
public class AuthProcessor {
    public static final String AUTH0_DOMAIN = "auth0Domain";
    public static final String AUTH0_CLIENT_ID = "auth0ClientId";
    public static final String AUTH0_CLIENT_SECRET = "auth0ClientSecret";

    private static final int DEFAULT_PW_LENGTH = 7;

    private final AuthAPI auth;


    @Inject
    public AuthProcessor(@Named(AUTH0_DOMAIN) final String domain,
                         @Named(AUTH0_CLIENT_ID) final String clientId,
                         @Named(AUTH0_CLIENT_SECRET) final String clientSecret) {

        this.auth = new AuthAPI(domain, clientId, clientSecret);
    }

    public String userSignUp(String email, String firstName, String lastName) throws AuthException {
        // Generate password and create new user on Auth0
        String password = RandomStringUtils.randomAlphanumeric(DEFAULT_PW_LENGTH);

        Map<String, String> fields = new HashMap<>();
        fields.put("given_name", firstName);
        fields.put("family_name", lastName);
        SignUpRequest request = auth.signUp(email, password, "Username-Password-Authentication")
                .setCustomFields(fields);
        try {
            CreatedUser user = request.execute();
            log.debug("User signed up on Auth0. User ID (Auth0): " + user.getUserId());
        } catch (Exception e) {
            throw new AuthException("Unable to sugn up user [" + email + "] on Auth0: " + e.getMessage(), e);
        }

        return password;
    }

    // Helper

    public class AuthException extends Exception {
        public AuthException(String err, Exception e) {
            super(err, e);
        }
    }
}
