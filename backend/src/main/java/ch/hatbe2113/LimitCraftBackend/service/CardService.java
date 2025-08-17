package ch.hatbe2113.LimitCraftBackend.service;

import ch.hatbe2113.LimitCraftBackend.entities.Card;
import ch.hatbe2113.LimitCraftBackend.entities.Recipe;
import ch.hatbe2113.LimitCraftBackend.entities.requests.PostCardRequest;

import ch.hatbe2113.LimitCraftBackend.repositories.ReceiptRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CardService {
    private final AiService aiService;
    private final ReceiptRepository receiptRepository;

    public CardService(AiService aiService, ReceiptRepository receiptRepository) {
        this.aiService = aiService;
        this.receiptRepository = receiptRepository;
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
        Optional<Recipe> recipe = this.receiptRepository.findByWords(word1, word2);

        Card card;

        if(recipe.isPresent()) {
            // if it's in the db
            card = new Card(recipe.get().getResultWord(), recipe.get().getResultIcon());
            System.out.println("FROM MEMORY");
        } else {
            // if not in db
            System.out.println("FROM AI");
            card = this.aiService.getCardFromWords(word1, word2);

            Recipe newRecipe = new Recipe();
            newRecipe.setWord1(word1);
            newRecipe.setWord2(word2);
            newRecipe.setResultWord(card.getWord());
            newRecipe.setResultIcon(card.getIcon());

            this.receiptRepository.save(newRecipe);
        }

        return card;
    }
}
