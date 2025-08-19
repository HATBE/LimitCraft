package ch.hatbe2113.LimitCraftBackend.service;

import ch.hatbe2113.LimitCraftBackend.entities.WordCard;
import ch.hatbe2113.LimitCraftBackend.entities.Recipe;
import ch.hatbe2113.LimitCraftBackend.entities.requests.PostCardRequest;

import ch.hatbe2113.LimitCraftBackend.repositories.ReceiptRepository;
import ch.hatbe2113.LimitCraftBackend.repositories.WordCardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WordCardService {
    private final AiService aiService;
    private final ReceiptRepository receiptRepository;
    private final WordCardRepository wordCardRepository;

    public WordCardService(AiService aiService, ReceiptRepository receiptRepository, WordCardRepository wordCardRepository) {
        this.aiService = aiService;
        this.receiptRepository = receiptRepository;
        this.wordCardRepository = wordCardRepository;
    }

    // TODO: make auto create for the default 4 items on startup
    public List<WordCard> getDefaultWordCards() {
        return this.wordCardRepository.findDefault();
    }

    public WordCard combineWordCards(PostCardRequest request) {
        WordCard wordCard1 = this.wordCardRepository.findById(request.getWordCardId1())
                .orElseThrow(() -> new IllegalArgumentException("WordCard 1 does not exist!"));
        WordCard wordCard2 = this.wordCardRepository.findById(request.getWordCardId2())
                .orElseThrow(() -> new IllegalArgumentException("WordCard 2 does not exist!"));

        Optional<Recipe> existingRecipe = this.receiptRepository.findByWordCardIds(wordCard1.getId(), wordCard2.getId());

        WordCard resultWordCard;

        if (existingRecipe.isPresent()) {
            // recipe already exists in db, so it's cached
            resultWordCard = existingRecipe.get().getResultWordCard();
            System.out.printf("GOT %s + %s = %s from MEMORY%n", wordCard1.getWord(), wordCard2.getWord(), resultWordCard.getWord());
        } else {
            // recipe does not exist in db cache yet, so wee ned AI to help
            WordCard candidate = this.aiService.getCardFromWords(wordCard1.getWord(), wordCard2.getWord());

            Optional<WordCard> existingWordCard = this.wordCardRepository.findByWord(candidate.getWord());

            resultWordCard = existingWordCard.orElseGet(() -> this.wordCardRepository.save(candidate)); // when it does not already exist, save it to db

            Recipe newRecipe = new Recipe(wordCard1, wordCard2, resultWordCard);
            this.receiptRepository.save(newRecipe);

            System.out.println(String.format("GOT %s + %s = %s from AI%n", wordCard1.getWord(), wordCard2.getWord(), resultWordCard.getWord()));
        }

        return resultWordCard;
    }
}
