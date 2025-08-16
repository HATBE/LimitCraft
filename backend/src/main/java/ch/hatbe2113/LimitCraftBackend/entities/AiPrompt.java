package ch.hatbe2113.LimitCraftBackend.entities;

public class AiPrompt {
    private String model;
    private String system;
    private String prompt;
    private boolean stream;
    private String keep_alive;

    public AiPrompt(String model, String system, String prompt, boolean stream, String keep_alive) {
        this.model = model;
        this.system = system;
        this.prompt = prompt;
        this.stream = stream;
        this.keep_alive = keep_alive;
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

    public String getKeep_alive() {
        return keep_alive;
    }
}
