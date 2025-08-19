package ch.hatbe2113.LimitCraftBackend.controller;

import ch.hatbe2113.LimitCraftBackend.Exception.ErrorResponse;
import ch.hatbe2113.LimitCraftBackend.entities.WordCard;
import ch.hatbe2113.LimitCraftBackend.entities.requests.PostCardRequest;
import ch.hatbe2113.LimitCraftBackend.service.WordCardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cards")
public class WordCardController {
    private final WordCardService wordCardService;

    public WordCardController(WordCardService wordCardService) {
        this.wordCardService = wordCardService;
    }

    @GetMapping(value = {"", "/"})
    public ResponseEntity<?> getInitialCards() {
        return ResponseEntity.ok(this.wordCardService.getDefaultWordCards());
    }

    @PostMapping(value = {"", "/"})
    public ResponseEntity<?> postCards(@RequestBody @Valid PostCardRequest request) {
        WordCard wordCard = this.wordCardService.combineWordCards(request);

        if (wordCard == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Error while combining card", "CARD_COMBINATION_ERROR"));
        }

        return ResponseEntity.ok(wordCard);
    }
}
