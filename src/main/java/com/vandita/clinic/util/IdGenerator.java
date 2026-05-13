package com.vandita.clinic.util;

import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class IdGenerator {
    private static final AtomicLong COUNTER = new AtomicLong(1000);

    public String generate(String prefix) {
        return prefix.toUpperCase() + "-" + COUNTER.incrementAndGet();
    }

    public String uuid() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
