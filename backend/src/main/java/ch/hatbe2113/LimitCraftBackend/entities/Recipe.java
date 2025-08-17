package ch.hatbe2113.LimitCraftBackend.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "recipe")
public class Recipe {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id", nullable = false, updatable = false, length = 36)
    private String id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "word1", nullable = false)
    private Card word1;

    @ManyToOne(optional = false)
    @JoinColumn(name = "word2", nullable = false)
    private Card word2;

    @ManyToOne(optional = false)
    @JoinColumn(name = "resultWord", nullable = false)
    private Card resultWord;

    public Card getResultWord() {
        return this.resultWord;
    }

    public String getId() {
        return this.id;
    }

    public Card getWord1() {
        return this.word1;
    }

    public Card getWord2() {
        return this.word2;
    }

    public void setWord1(Card word1) {
        this.word1 = word1;
    }

    public void setWord2(Card word2) {
        this.word2 = word2;
    }

    public void setResultWord(Card resultWord) {
        this.resultWord = resultWord;
    }
}
