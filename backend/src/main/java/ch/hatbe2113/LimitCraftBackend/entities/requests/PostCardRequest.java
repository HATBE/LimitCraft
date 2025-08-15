package ch.hatbe2113.LimitCraftBackend.entities.requests;

import jakarta.validation.constraints.NotBlank;


public class PostCardRequest {
    @NotBlank(message = "Card Name 1 cant be empty.")
    private String cardName1;

    @NotBlank(message = "Card Name 2 cant be empty.")
    private String cardName2;

    public String getCardName1() {
        return cardName1;
    }

    public String getCardName2() {
        return cardName2;
    }
}
