package com.vandita.clinic.service;

import com.vandita.clinic.model.TimeSlot;
import com.vandita.clinic.store.InMemoryStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class SlotService {

    @Autowired private InMemoryStore store;

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("hh:mm a", Locale.US);

    public List<TimeSlot> getAvailableSlots(String date) {
        List<TimeSlot> slots = new ArrayList<>();
        // Morning: 9:00 AM - 1:00 PM every 30 min
        addSlots(slots, date, "09:00", "13:00");
        // Evening: 4:00 PM - 8:00 PM every 30 min
        addSlots(slots, date, "16:00", "20:00");
        return slots;
    }

    private void addSlots(List<TimeSlot> slots, String date,
                          String startStr, String endStr) {
        LocalTime cur = LocalTime.parse(startStr);
        LocalTime end = LocalTime.parse(endStr);
        while (cur.isBefore(end)) {
            String label = cur.format(FMT).replace("AM", "AM").replace("PM", "PM");
            String key = date + "|" + label;
            boolean blocked = store.blockedSlots.contains(key);
            long booked = store.appointments.stream()
                .filter(a -> a.getDate().equals(date) && label.equals(a.getSlot())
                    && !"cancelled".equals(a.getStatus()))
                .count();
            slots.add(new TimeSlot(label, !blocked && booked < 2, blocked, (int) booked, 2));
            cur = cur.plusMinutes(30);
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
