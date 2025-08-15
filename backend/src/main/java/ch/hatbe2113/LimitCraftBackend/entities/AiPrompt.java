package ch.hatbe2113.LimitCraftBackend.entities;

public class AiPrompt {
    private String model;
    private String system;
    private String prompt;
    private boolean stream;

    public AiPrompt(String model, String system, String prompt, boolean stream) {
        this.model = model;
        this.system = system;
        this.prompt = prompt;
        this.stream = stream;
    }

    public String getModel() {
        return model;
    }

    public String getPrompt() {
        return prompt;
    }

    public String getSystem() {
        return system;
    }

    public boolean getStream() {
        return stream;
    }
}
