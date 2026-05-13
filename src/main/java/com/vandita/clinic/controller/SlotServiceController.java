package com.vandita.clinic.controller;

import com.vandita.clinic.model.TimeSlot;
import com.vandita.clinic.service.SlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slots")
public class SlotServiceController {

    @Autowired
    private SlotService slotService;

    @GetMapping("/available")
    public List<TimeSlot> getAvailable(@RequestParam String date) {
        return slotService.getAvailableSlots(date);
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
