package ch.hatbe2113.LimitCraftBackend.entities.requests;

import jakarta.validation.constraints.NotBlank;

public class PostCardRequest {
    @NotBlank(message = "ID of the first word card cant be empty.")
    private String wordCardId1;

    @NotBlank(message = "ID of the second word card cant be empty.")
    private String wordCardId2;

    public String getWordCardId1() {
        return wordCardId1;
    }

    public String getWordCardId2() {
        return wordCardId2;
    }

    public void setWordCardId1(String wordCardId1) {
        this.wordCardId1 = wordCardId1;
    }

    public void setWordCardId2(String wordCardId2) {
        this.wordCardId2 = wordCardId2;
    }
}