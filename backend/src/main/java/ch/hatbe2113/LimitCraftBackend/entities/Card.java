package ch.hatbe2113.LimitCraftBackend.entities;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class Card {
    private String word;

    private String icon;

    public Card(String word, String icon) {
        this.word = word;
        this.icon = icon;
    }

    public String getWord() {
        return word;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public void setWord(String word) {
        this.word = word;
    }
}
