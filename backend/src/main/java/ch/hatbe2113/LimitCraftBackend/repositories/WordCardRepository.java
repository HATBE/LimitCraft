package ch.hatbe2113.LimitCraftBackend.repositories;

import ch.hatbe2113.LimitCraftBackend.entities.WordCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface WordCardRepository  extends JpaRepository<WordCard, Integer> {
    @Query("SELECT w FROM WordCard AS w WHERE w.id = :id")
    Optional<WordCard> findById(String id);

    @Query("SELECT w FROM WordCard AS w WHERE w.word = :word")
    Optional<WordCard> findByWord(String word);

    @Query("SELECT w FROM WordCard AS w WHERE w.isDefault = true")
    List<WordCard> findDefault();
}
