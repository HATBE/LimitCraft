package ch.hatbe2113.LimitCraftBackend.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "cards")
public class Card {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id", nullable = false, updatable = false, length = 36)
    private String id;

    @Column(name = "word", nullable = false)
    private String word;

    @Column(name = "icon", nullable = false)
    private String icon;

    public String getId() {
        return id;
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
