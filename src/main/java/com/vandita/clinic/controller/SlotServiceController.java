package com.vandita.clinic.controller;

import com.vandita.clinic.model.TimeSlot;
import com.vandita.clinic.service.SlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slots")
public class SlotServiceController {

    @Autowired
    private SlotService slotService;

    @GetMapping("/available")
    public ResponseEntity<?> getAvailable(@RequestParam String date) {
        try {
            if (date == null || date.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Date parameter is required"));
            }
            List<TimeSlot> slots = slotService.getAvailableSlots(date);
            return ResponseEntity.ok(slots);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "An unexpected error occurred"));
        }
    }

    @GetMapping("/blocked")
    public List<String> getBlocked() {
        return slotService.getAllBlocked();
    }

    @PostMapping("/block")
    public void block(@RequestBody Map<String, String> body) {
        slotService.blockSlot(body.get("date"), body.get("slot"));
    }

    @DeleteMapping("/unblock")
    public void unblock(@RequestParam String date, @RequestParam String slot) {
        slotService.unblockSlot(date, slot);
    }
}
