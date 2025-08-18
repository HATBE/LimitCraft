package ch.hatbe2113.LimitCraftBackend.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "cards")
public class WordCard {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id", nullable = false, updatable = false, length = 36)
    private String id;

    @Column(name = "word", nullable = false)
    private String word;

    @Column(name = "icon", nullable = false)
    private String icon;

    @Column(name = "isDefault", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isDefault;

    protected WordCard() {} // for JPA

    public WordCard(String word, String icon) {
        this.word = word;
        this.icon = icon;
    }

    public String getId() {
        return id;
    }

    public String getWord() {
        return word;
    }

    public String getIcon() {
        return icon;
    }

    public boolean isDefault() {
        return isDefault;
    }
}
