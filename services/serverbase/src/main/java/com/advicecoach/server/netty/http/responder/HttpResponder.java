package com.advicecoach.server.netty.http.responder;

import io.netty.handler.codec.http.*;

import java.util.Optional;

import static io.netty.buffer.Unpooled.copiedBuffer;

/**
 * Created by nanxiao on 9/3/16.
 */
public abstract class HttpResponder {
    public FullHttpResponse processRequest(final FullHttpRequest request) {
        FullHttpResponse response = createResponse(HttpResponseStatus.INTERNAL_SERVER_ERROR, "Missing case error");

        if (isSupportedVersion(request)) {
            final HttpHeaders headers = request.headers();
            final Optional<String> host = Optional.ofNullable(headers.get("Host"));

            if (isAllowedHost(host)) {
                if (haveMatchingResource(request)) {
                    if (isSupportedMethod(request)) {
                        response = generateResponse(request);
                    } else {
                        response = createResponse(HttpResponseStatus.METHOD_NOT_ALLOWED);
                    }
                } else {
                    response = createResponse(HttpResponseStatus.NOT_FOUND);
                }
            } else {
                response = createResponse(HttpResponseStatus.FORBIDDEN);
            }
        } else {
            response = new DefaultFullHttpResponse(HttpVersion.HTTP_1_0,
                    HttpResponseStatus.HTTP_VERSION_NOT_SUPPORTED,
                    copiedBuffer("HTTP 1.1 Required".getBytes()));
        }

        if (HttpHeaders.isKeepAlive(request)) {
            response.headers().set(HttpHeaders.Names.CONNECTION, HttpHeaders.Values.KEEP_ALIVE);
        }
        response.headers().set(HttpHeaders.Names.CONTENT_TYPE, "text/plain");

        return response;
    }

    protected abstract boolean haveMatchingResource(final HttpRequest request);

    protected abstract boolean isSupportedMethod(final HttpRequest request);

    protected abstract FullHttpResponse generateResponse(final HttpRequest request);

    protected boolean isSupportedVersion(final HttpRequest request) {
        return HttpVersion.HTTP_1_1 == request.protocolVersion();
    }

    protected boolean isAllowedHost(final Optional<String> host) {
        return true;
    }

    public static FullHttpResponse createSuccessResponse() {
        return createSuccessResponse(HttpResponseStatus.OK.reasonPhrase());
    }

    public static FullHttpResponse createSuccessResponse(final String payload) {
        return createResponse(HttpResponseStatus.OK, payload);
    }

    public static FullHttpResponse createResponse(final HttpResponseStatus status) {
        return createResponse(status, status.reasonPhrase());
    }

    public static FullHttpResponse createResponse(final HttpResponseStatus status, String payload) {
        return createResponse(status, payload.getBytes());
    }

    public static FullHttpResponse createResponse(final HttpResponseStatus status, byte[] payload) {
        return createResponse(status, payload, HttpVersion.HTTP_1_1);
    }

    public static FullHttpResponse createResponse(final HttpResponseStatus status, byte[] payload, final HttpVersion version) {
        if (0 < payload.length) {
            FullHttpResponse response = new DefaultFullHttpResponse(version, status, copiedBuffer(payload));
            response.headers().set(HttpHeaders.Names.CONTENT_LENGTH, payload.length);
            response.headers().set(HttpHeaders.Names.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
            return response;
        } else {
            return new DefaultFullHttpResponse(version, status);
        }
    }
}
