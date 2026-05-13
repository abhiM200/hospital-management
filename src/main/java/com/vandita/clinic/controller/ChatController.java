package com.vandita.clinic.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Value("${clinic.anthropic.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, Object> request) {
        String userMessage = (String) request.get("message");
        
        if (apiKey == null || apiKey.isBlank()) {
            return Map.of("reply", "I am currently offline. Please contact the clinic at 7005574327 for any queries.");
        }

        try {
            String url = "https://api.anthropic.com/v1/messages";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey);
            headers.set("anthropic-version", "2023-06-01");

            Map<String, Object> body = new HashMap<>();
            body.put("model", "claude-3-haiku-20240307");
            body.put("max_tokens", 1024);
            body.put("system", "You are a helpful assistant for Dr. Vandita's Homeopathy Clinic in Gorakhpur. " +
                    "Answer questions about treatments, appointments, timings, and homeopathy. " +
                    "Always recommend consulting Dr. Vandita for diagnosis. Be warm and concise. " +
                    "Clinic phone: 7005574327. Address: Padri Bazar, Mohanapur, Gorakhpur. " +
                    "Timings: Mon–Sat, 9AM–1PM and 4PM–8PM.");
            
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", userMessage));
            body.put("messages", messages);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);
            
            List<Map<String, Object>> content = (List<Map<String, Object>>) response.get("content");
            String reply = (String) content.get(0).get("text");
            
            return Map.of("reply", reply);
        } catch (Exception e) {
            return Map.of("reply", "Sorry, I encountered an error. Please try again later or call the clinic.");
        }
    }
}
