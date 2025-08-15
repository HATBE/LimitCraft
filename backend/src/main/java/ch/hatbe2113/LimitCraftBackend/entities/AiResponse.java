package ch.hatbe2113.LimitCraftBackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AiResponse {
    private String response;

    public String getResponse() {
        return response;
    }
}
