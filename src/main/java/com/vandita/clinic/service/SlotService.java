package com.vandita.clinic.service;

import com.vandita.clinic.model.TimeSlot;
import com.vandita.clinic.store.InMemoryStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;

@Service
public class SlotService {

    @Autowired private InMemoryStore store;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("hh:mm a", Locale.US);
    private final Random random = new Random();

    public List<TimeSlot> getAvailableSlots(String date) {
        // Validate date format (YYYY-MM-DD)
        try {
            LocalDate targetDate = LocalDate.parse(date);
            if (targetDate.isBefore(LocalDate.now())) {
                return new ArrayList<>(); // No slots for past dates
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD");
        }

        List<TimeSlot> slots = new ArrayList<>();
        
        // Static Business Rules for Slots
        // Morning: 09:00 AM - 01:00 PM (8 slots)
        generate(slots, date, "09:00", "13:00");
        
        // Evening: 04:00 PM - 08:00 PM (8 slots)
        generate(slots, date, "16:00", "20:00");

        return slots;
    }

    private void generate(List<TimeSlot> slots, String date, String start, String end) {
        LocalTime current = LocalTime.parse(start);
        LocalTime stop = LocalTime.parse(end);
        
        // Current time for same-day booking prevention
        LocalDate targetDate = LocalDate.parse(date);
        boolean isToday = targetDate.equals(LocalDate.now());
        LocalTime now = LocalTime.now();

        while (current.isBefore(stop)) {
            String timeLabel = current.format(FMT);
            String key = date + "|" + timeLabel;
            
            boolean isBlocked = store.blockedSlots.contains(key);
            
            // Check current bookings in memory
            long bookedCount = store.appointments.stream()
                .filter(a -> a.getDate().equals(date) && a.getSlot().equalsIgnoreCase(timeLabel))
                .filter(a -> !a.getStatus().equalsIgnoreCase("cancelled"))
                .count();

            int capacity = 2; // Fixed capacity rule
            
            // Availability Rules:
            // 1. Not manually blocked
            // 2. Not in the past (if today)
            // 3. Below capacity
            boolean isInPast = isToday && current.isBefore(now.plusMinutes(30));
            boolean isAvailable = !isBlocked && !isInPast && (bookedCount < capacity);

            slots.add(new TimeSlot(
                timeLabel,
                isAvailable,
                isBlocked,
                (int) bookedCount,
                capacity
            ));

            current = current.plusMinutes(30);
        }
    }

    public void blockSlot(String date, String slot) {
        store.blockedSlots.add(date + "|" + slot);
    }

    public void unblockSlot(String date, String slot) {
        store.blockedSlots.remove(date + "|" + slot);
    }

    public List<String> getAllBlocked() {
        return new ArrayList<>(store.blockedSlots);
    }
}
