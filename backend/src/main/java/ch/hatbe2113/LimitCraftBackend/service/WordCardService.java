package ch.hatbe2113.LimitCraftBackend.service;

import ch.hatbe2113.LimitCraftBackend.entities.WordCard;
import ch.hatbe2113.LimitCraftBackend.entities.Recipe;
import ch.hatbe2113.LimitCraftBackend.entities.requests.PostCardRequest;

import ch.hatbe2113.LimitCraftBackend.repositories.ReceiptRepository;
import ch.hatbe2113.LimitCraftBackend.repositories.WordCardRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
        List<WordCard> wordCards = this.wordCardRepository.findDefault();
        return wordCards;
    }

    public WordCard combineWordCards(PostCardRequest request) {
        WordCard wordCard1 = this.wordCardRepository.findById(request.getWordCardId1())
                .orElseThrow(() -> new IllegalArgumentException("ID of WordCard 1 does not exist!"));
        WordCard wordCard2 = this.wordCardRepository.findById(request.getWordCardId2())
                .orElseThrow(() -> new IllegalArgumentException("ID of WordCard 2 does not exist!"));

        // check if recipe is in db
        Optional<Recipe> recipe = this.receiptRepository.findByWordCardIds(wordCard1.getId(), wordCard2.getId());

        WordCard resultWordCard;

        if(recipe.isPresent()) {
            // if it's in the db
            resultWordCard = recipe.get().getResultWordCard();

            System.out.println(String.format("GOT %s + %s = %s from MEMORY", request.getWordCardId1(), request.getWordCardId2(), resultWordCard));
        } else {
            // if not in db
            resultWordCard = this.aiService.getCardFromWords(wordCard1.getWord(), wordCard2.getWord());
            this.wordCardRepository.save(resultWordCard);

            // now check if this word already exists
            Optional<WordCard> dbWordCard = this.wordCardRepository.findByWord(resultWordCard.getWord());

            if(dbWordCard.isPresent()) {
                // if this word already exists in db, then use this, to avoid creation a new one with same name and possibly different icon
                resultWordCard = dbWordCard.get();
            }

            // create new recipe
            Recipe newRecipe = new Recipe(wordCard1, wordCard2, resultWordCard);
            this.receiptRepository.save(newRecipe);

            System.out.println(String.format("GOT %s + %s = %s from AI", request.getWordCardId1(), request.getWordCardId2(), resultWordCard));
        }

        return resultWordCard;
    }
}
