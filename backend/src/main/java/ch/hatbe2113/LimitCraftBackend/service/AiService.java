package ch.hatbe2113.LimitCraftBackend.service;

import ch.hatbe2113.LimitCraftBackend.entities.AiPrompt;
import ch.hatbe2113.LimitCraftBackend.entities.AiResponse;
import ch.hatbe2113.LimitCraftBackend.entities.WordCard;
import ch.hatbe2113.LimitCraftBackend.http.HttpRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.stereotype.Service;

@Service
public class AiService {
    private final String modelName = "phi4:14b";
    private final String aiServerGenerateUrl = "http://localhost:11435/api/generate";

    public WordCard getCardFromWords(String word1, String word2) {
        String resultWord = this.combineWords(word1, word2);
        String resultIcon = this.getIcon(resultWord);

        if(resultWord == null || resultIcon == null) {
            return null;
        }

        resultIcon = new String(Character.toChars(resultIcon.codePointAt(0))); // only the emoji (first), in case AI thinks again it's funny

        resultWord = resultWord.substring(0, 1).toUpperCase() + resultWord.substring(1); // first letter big, all the others small
        resultWord = resultWord.split("\n")[0]; // remove \n that AI sometimes adds
        resultWord = resultWord.split(" ")[0]; // remove space that AI sometimes adds

        return new WordCard(resultWord, resultIcon);
    }

    private String combineWords(String word1, String word2) {
        AiPrompt wordPrompt = new AiPrompt(
                this.modelName,
                "You combine two given words into a single related noun. Hard rules: - Output exactly one lowercase noun. - No spaces, no punctuation, no numbers, no emojis, no code, no commands. - Do NOT include either input word, any of their inflections, or obvious substrings. - No explanations, no chain-of-thought, no <think> blocks. - NO Note block where you give a sidenote, just that one word- The noun must plausibly relate to BOTH inputs (association or role), not just one. - Please use simple words, that also kids can understand. Examples: earth + water = plant; fire + air = smoke; stone + time = fossil; metal + heat = forge; water + fire = steam. All the words must be existing english words.",
                String.format("Combine \"%s\" + \"%s\". Reply with one lowercase noun only, without using either input word or their variants.", word1, word2),
                false,
                "24h"
        );
        return this.aiRequest(wordPrompt);
    }

    private String getIcon(String word) {
        AiPrompt iconPrompt = new AiPrompt(
                this.modelName,
                "You map one input word to its most relevant Unicode emoji. Rules: - Output exactly one emoji character (Unicode), nothing else. - No text, no labels, no shortcodes, no quotes, no spaces, no punctuation, no code. - Prefer common, single-codepoint emojis; avoid skin-tone or gender variants unless the word requires it. - If several fit, choose the most widely recognized, generic one. - No explanations or reasoning; do not output <think> blocks. - No ^Note block where you give a sidenote about the emoji, just the single emoji",
                String.format("Word: %s . Reply with exactly one emoji only.", word),
                false,
                "24h"
        );
        return this.aiRequest(iconPrompt);
    }

    private String aiRequest(AiPrompt prompt) {
        ObjectMapper mapper = new ObjectMapper();
        HttpRequest http = new HttpRequest();

        try {
            Response wordResponse = http.post(this.aiServerGenerateUrl, Entity.entity(prompt, MediaType.APPLICATION_JSON));

            if(wordResponse.getStatus() != 200) {
               System.out.println("ERROR: AI Request: NOT a 200 Response!");
               return null;
            }

            String wordBody = wordResponse.readEntity(String.class);
            AiResponse wordAiResponse = mapper.readValue(wordBody, new TypeReference<>(){});

            return wordAiResponse.getResponse();
        } catch(JsonProcessingException e) {
            e.printStackTrace();
        } finally {
            http.close();
        }

        return null;
    }
}