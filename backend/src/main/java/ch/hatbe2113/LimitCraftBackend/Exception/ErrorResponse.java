package ch.hatbe2113.LimitCraftBackend.Exception;

import java.util.List;


public class ErrorResponse {
    private String message;
    private String code;
    private List<String> errors;

    public ErrorResponse(String message, String code) {
        this.message = message;
        this.code = code;
    }

    public ErrorResponse(String message, String code, List<String> errors) {
        this.message = message;
        this.code = code;
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
