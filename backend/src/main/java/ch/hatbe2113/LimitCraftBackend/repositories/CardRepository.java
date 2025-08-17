package ch.hatbe2113.LimitCraftBackend.repositories;

import ch.hatbe2113.LimitCraftBackend.entities.Card;
import ch.hatbe2113.LimitCraftBackend.entities.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Integer> {
    @Query("SELECT r FROM Recipe AS r WHERE (r.word1.word = :word1 AND r.word2.word = :word2) OR  (r.word1.word = :word2 AND r.word2.word = :word1)")
    Optional<Recipe> findByWords(String word1, String word2);
}
