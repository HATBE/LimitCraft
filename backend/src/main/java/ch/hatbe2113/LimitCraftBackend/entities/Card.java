package ch.hatbe2113.LimitCraftBackend.entities;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class Card {
    private String word;
    private String icon;

    public Card(String word, String icon) {
        this.word = word;
        this.icon = icon;
    }

    public String getIcon() {
        return icon;
    }

    public String getWord() {
        return word;
    }
}
