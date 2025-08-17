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

    @Column(name = "word1", nullable = false)
    private String word1;

    @Column(name = "word2", nullable = false)
    private String word2;

    @Column(name = "resultWord", nullable = false)
    private String resultWord;

    @Column(name = "resultIcon", nullable = false)
    private String resultIcon;

    public String getResultWord() {
        return this.resultWord;
    }

    public String getId() {
        return this.id;
    }

    public String getWord1() {
        return this.word1;
    }

    public String getWord2() {
        return this.word2;
    }

    public String getResultIcon() {
        return resultIcon;
    }

    public void setResultIcon(String resultIcon) {
        this.resultIcon = resultIcon;
    }

    public void setWord1(String word1) {
        this.word1 = word1;
    }

    public void setWord2(String word2) {
        this.word2 = word2;
    }

    public void setResultWord(String resultWord) {
        this.resultWord = resultWord;
    }
}
