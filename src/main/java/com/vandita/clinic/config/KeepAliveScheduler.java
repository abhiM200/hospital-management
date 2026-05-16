package com.vandita.clinic.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.client.RestTemplate;

@Configuration
public class KeepAliveScheduler {

    private static final Logger logger = LoggerFactory.getLogger(KeepAliveScheduler.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${KEEP_ALIVE_ENABLED:false}")
    private boolean enabled;

    @Value("${RENDER_EXTERNAL_URL:}")
    private String externalUrl;

    @Scheduled(fixedRate = 600000) // Every 10 minutes
    public void keepAlive() {
        if (!enabled || externalUrl == null || externalUrl.isBlank()) {
            return;
        }

        try {
            String url = externalUrl.endsWith("/") ? externalUrl + "health" : externalUrl + "/health";
            logger.info("⚡ Keep-Alive: Pinging {} ...", url);
            String response = restTemplate.getForObject(url, String.class);
            logger.info("⚡ Keep-Alive: Ping successful! Response: {}", response);
        } catch (Exception e) {
            logger.warn("⚡ Keep-Alive: Ping failed: {}", e.getMessage());
        }
    }
}
