package com.vandita.clinic.service;

import com.vandita.clinic.model.ClinicSettings;
import com.vandita.clinic.store.InMemoryStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class SettingsService {

    @Autowired private InMemoryStore store;

    @Value("${clinic.admin.pin:1234}")
    private String initialPin;

    @PostConstruct
    public void init() {
        store.adminPin = initialPin;
    }

    public ClinicSettings getSettings() {
        return store.settings;
    }

    public ClinicSettings updateSettings(ClinicSettings updated) {
        store.settings = updated;
        return updated;
    }

    public boolean verifyPin(String pin) {
        return store.adminPin.equals(pin);
    }

    public boolean changePin(String oldPin, String newPin) {
        if (!store.adminPin.equals(oldPin)) return false;
        store.adminPin = newPin;
        return true;
    }
}
