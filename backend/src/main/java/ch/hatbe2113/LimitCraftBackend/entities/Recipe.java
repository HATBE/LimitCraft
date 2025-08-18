package ch.hatbe2113.LimitCraftBackend.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "recipes",
uniqueConstraints = {
        @UniqueConstraint(columnNames = {"word_card_1_id", "word_card2_id"})
})
public class Recipe {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "id", nullable = false, updatable = false, length = 36)
    private String id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "word_card_1_id", nullable = false)
    private WordCard wordCard1;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "word_card_2_id", nullable = false)
    private WordCard wordCard2;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "result_word_id", nullable = false)
    private WordCard resultWordCard;

    protected Recipe() {} // for JPA

    public Recipe(WordCard wordCard1, WordCard wordCard2, WordCard resultWordCard) {
        this.wordCard1 = wordCard1;
        this.wordCard2 = wordCard2;
        this.resultWordCard = resultWordCard;
    }

    public String getId() {
        return id;
    }

    public WordCard getWordCard1() {
        return wordCard1;
    }

    public WordCard getWordCard2() {
        return wordCard2;
    }

    public WordCard getResultWordCard() {
        return resultWordCard;
    }
}
