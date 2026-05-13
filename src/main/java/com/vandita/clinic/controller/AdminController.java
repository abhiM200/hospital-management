package com.vandita.clinic.controller;

import com.vandita.clinic.model.ClinicSettings;
import com.vandita.clinic.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AdminController {

    @Autowired
    private SettingsService settingsService;

    @GetMapping("/settings")
    public ClinicSettings getSettings() {
        return settingsService.getSettings();
    }

    @PutMapping("/settings")
    public ClinicSettings updateSettings(@RequestBody ClinicSettings settings) {
        return settingsService.updateSettings(settings);
    }

    @PostMapping("/admin/verify-pin")
    public Map<String, Boolean> verifyPin(@RequestBody Map<String, String> body) {
        return Map.of("valid", settingsService.verifyPin(body.get("pin")));
    }

    @PutMapping("/admin/change-pin")
    public ResponseEntity<Map<String, String>> changePin(@RequestBody Map<String, String> body) {
        if (settingsService.changePin(body.get("oldPin"), body.get("newPin"))) {
            return ResponseEntity.ok(Map.of("message", "PIN changed successfully"));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Incorrect old PIN"));
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP");
    }
}
