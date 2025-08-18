package ch.hatbe2113.LimitCraftBackend.repositories;

import ch.hatbe2113.LimitCraftBackend.entities.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ReceiptRepository extends JpaRepository<Recipe, Integer> {
    @Query("SELECT r FROM Recipe AS r WHERE (r.wordCard1.id = :id1 AND r.wordCard2.id = :id2) OR  (r.wordCard1.id= :id2 AND r.wordCard2.id= :id1) ORDER BY r.resultWordCard.id LIMIT 1")
    Optional<Recipe> findByWordCardIds(String id1, String id2);
}
