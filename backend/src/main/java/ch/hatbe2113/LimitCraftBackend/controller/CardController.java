package ch.hatbe2113.LimitCraftBackend.controller;

import ch.hatbe2113.LimitCraftBackend.entities.Card;
import ch.hatbe2113.LimitCraftBackend.entities.requests.PostCardRequest;
import ch.hatbe2113.LimitCraftBackend.service.CardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cards")
public class CardController {
    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping(value = {"", "/"})
    public ResponseEntity<?> getInitialCards() {
        List<Card> cards = this.cardService.getCards();
        return ResponseEntity.ok(cards);
    }

    @PostMapping(value = {"", "/"})
    public ResponseEntity<?> postCards(@RequestBody @Valid PostCardRequest request) {
        Card card = this.cardService.postCard(request);
        return ResponseEntity.ok(card);
    }
}
