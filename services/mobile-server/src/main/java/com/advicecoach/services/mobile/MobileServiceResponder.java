package com.advicecoach.services.mobile;

import com.advicecoach.services.mobile.impl.Router;
import com.advicecoach.server.netty.http.responder.HttpResponder;
import com.google.inject.Inject;
import io.netty.handler.codec.http.FullHttpResponse;
import io.netty.handler.codec.http.HttpRequest;
import io.netty.handler.codec.http.HttpResponseStatus;

import java.util.Map;
import java.util.function.Function;

/**
 * Created by nanxiao on 9/3/16.
 */
public final class MobileServiceResponder extends HttpResponder {
    private final Map<String, Function<HttpRequest, String>> funcMap;

    @Inject
    public MobileServiceResponder(final Router router) {
        funcMap = router.getFuncMap();
    }

    @Override
    protected boolean haveMatchingResource(HttpRequest request) {
        return true;
    }

    @Override
    protected boolean isSupportedMethod(HttpRequest request) {
        return funcMap.containsKey(request.uri());
    }

    @Override
    protected FullHttpResponse generateResponse(HttpRequest request) {
        try {
            String response = funcMap.get(request.uri()).apply(request);
            return createSuccessResponse(response);
        } catch (Exception e) {
            return createResponse(HttpResponseStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}

