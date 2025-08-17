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

    public String getPrompt() {
        return this.prompt;
    }

    public String getKeep_alive() {
        return this.keep_alive;
    }

    public String getSystem() {
        return this.system;
    }

    public String getModel() {
        return this.model;
    }

    public boolean getStream() {
        return this.stream;
    }
}
