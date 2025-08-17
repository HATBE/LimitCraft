package ch.hatbe2113.LimitCraftBackend.repositories;

import ch.hatbe2113.LimitCraftBackend.entities.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ReceiptRepository extends JpaRepository<Recipe, Integer> {
    @Query("SELECT r FROM Recipe AS r WHERE (r.word1 = :word1 AND r.word2 = :word2) OR  (r.word1= :word2 AND r.word2= :word1) ORDER BY r.resultWord LIMIT 1")
    Optional<Recipe> findByWords(String word1, String word2);

    @Query("SELECT r FROM Recipe AS r WHERE r.resultWord = :word ORDER BY r.resultWord LIMIT 1")
    Optional<Recipe> findByResultWordName(String word);
}
