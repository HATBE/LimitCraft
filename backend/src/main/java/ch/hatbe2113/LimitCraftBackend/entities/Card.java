package ch.hatbe2113.LimitCraftBackend.entities;

import com.fasterxml.jackson.annotation.JsonAutoDetect;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class Card {
    private String name;
    private String icon;

    public Card(String name, String icon) {
        this.name = name;
        this.icon = icon;
    }

    public String getIcon() {
        return icon;
    }

    public String getName() {
        return name;
    }
}
