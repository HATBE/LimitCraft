package ch.hatbe2113.LimitCraftBackend.http;

import com.fasterxml.jackson.jakarta.rs.json.JacksonJsonProvider;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.client.Invocation.Builder;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;

public class HttpRequest {
    private final ResteasyClient client;

    public HttpRequest() {
        this.client = (ResteasyClient) ResteasyClientBuilder.newBuilder().build();
        this.client.register(JacksonJsonProvider.class);
    }

    private Builder baseRequest(String url) {
        return this.client
                .target(url)
                .request(MediaType.APPLICATION_JSON);
    }

    public Response post(String url, Entity body) {
        return this.baseRequest(url).post(body);
    }

    public Response get(String url) {
        return this.baseRequest(url).get();
    }
}
