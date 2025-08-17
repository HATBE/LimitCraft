package ch.hatbe2113.LimitCraftBackend.service;

import ch.hatbe2113.LimitCraftBackend.entities.Card;
import ch.hatbe2113.LimitCraftBackend.entities.Recipe;
import ch.hatbe2113.LimitCraftBackend.entities.requests.PostCardRequest;

import ch.hatbe2113.LimitCraftBackend.repositories.CardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CardService {
    private final AiService aiService;
    private final CardRepository cardRepository;

    public CardService(AiService aiService, CardRepository cardRepository) {
        this.aiService = aiService;
        this.cardRepository = cardRepository;
    }

    public List<Card> getCards() {
        return null;
        /*List<Card> cards = new ArrayList<>();

        cards.add(new Card("Water", "\uD83D\uDCA7"));
        cards.add(new Card("Fire", "\uD83D\uDD25"));
        cards.add(new Card("Wind", "\uD83C\uDF2C\uFE0F"));
        cards.add(new Card("Earth", "\uD83C\uDF0E"));

        return cards;*/
    }

    public Card postCard(PostCardRequest request) {
        String word1 = request.getCardName1();
        String word2 = request.getCardName2();

        // check if recipe is in db
        Optional<Recipe> recipe = this.cardRepository.findByWords(word1, word2);

        Card card;

        if(recipe.isEmpty()) {
            // if not in db,
            // 1. get word card from ai
            card = this.aiService.getCardFromWords(word1, word2);

            // 2. TODO: check if word1 is in database
            Card card1 = new Card();
            card1.setWord(word1);

            // 3. TODO: check if word2 is in database

            // 4. TODO: create recipe

            Recipe newRecipe = new Recipe();
            newRecipe.setWord1(word1);
            newRecipe.setWord1(word2);


        } else {
            // if it is in db, just get the card
            card = recipe.get().getResultWord();
        }

        return card;
    }
}
