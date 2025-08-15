package ch.hatbe2113.LimitCraftBackend.service;

import ch.hatbe2113.LimitCraftBackend.entities.Card;
import ch.hatbe2113.LimitCraftBackend.entities.requests.PostCardRequest;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CardService {
    private final AiService aiService;

    public CardService(AiService aiService) {
        this.aiService = aiService;
    }

    public List<Card> getCards() {
        List<Card> cards = new ArrayList<>();

        cards.add(new Card("Water", "\uD83D\uDCA7"));
        cards.add(new Card("Fire", "\uD83D\uDD25"));
        cards.add(new Card("Wind", "\uD83C\uDF2C\uFE0F"));
        cards.add(new Card("Earth", "\uD83C\uDF0E"));

        return cards;
    }

    public Card postCard(PostCardRequest request) {
        return this.aiService.getCardFromWords(request.getCardName1(), request.getCardName2());
    }
}
