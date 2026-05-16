package com.vandita.clinic.service;

import com.vandita.clinic.model.Appointment;
import com.vandita.clinic.store.InMemoryStore;
import com.vandita.clinic.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired private InMemoryStore store;
    @Autowired private IdGenerator idGen;
    @Autowired private PatientService patientService;

    public List<Appointment> findAll() {
        return store.appointments.stream()
            .sorted(Comparator.comparing(Appointment::getDate).reversed()
                .thenComparing(Appointment::getCreatedAt).reversed())
            .collect(Collectors.toList());
    }

    public Optional<Appointment> findById(String id) {
        return store.appointments.stream().filter(a -> a.getId().equals(id)).findFirst();
    }

    public List<Appointment> findByPhone(String phone) {
        return store.appointments.stream()
            .filter(a -> a.getPhone().equals(phone))
            .sorted(Comparator.comparing(Appointment::getDate).reversed())
            .collect(Collectors.toList());
    }

    public List<Appointment> findByDate(String date) {
        return store.appointments.stream()
            .filter(a -> a.getDate().equals(date))
            .sorted(Comparator.comparing(Appointment::getSlot))
            .collect(Collectors.toList());
    }

    public synchronized Appointment create(Appointment appt) {
        // Double booking prevention logic (Synchronized for thread safety in-memory)
        long currentBookings = store.appointments.stream()
            .filter(a -> a.getDate().equals(appt.getDate()) && a.getSlot().equalsIgnoreCase(appt.getSlot()))
            .filter(a -> !a.getStatus().equalsIgnoreCase("cancelled"))
            .count();
        
        if (currentBookings >= 2) {
            throw new IllegalStateException("This slot is already fully booked. Please select another time.");
        }

        // Check if slot is manually blocked
        String key = appt.getDate() + "|" + appt.getSlot();
        if (store.blockedSlots.contains(key)) {
            throw new IllegalStateException("This slot is currently unavailable.");
        }

        appt.setId(idGen.uuid());
        appt.setTransactionId("TXN-" + System.currentTimeMillis() + "-" + idGen.uuid().substring(0, 8).toUpperCase());
        appt.setStatus("pending");
        appt.setCreatedAt(LocalDateTime.now().toString());
        
        store.appointments.add(appt);
        patientService.upsertFromAppointment(appt);
        
        return appt;
    }

    public Optional<Appointment> updateStatus(String id, String status) {
        Optional<Appointment> opt = findById(id);
        opt.ifPresent(a -> a.setStatus(status));
        return opt;
    }

    public boolean delete(String id) {
        return store.appointments.removeIf(a -> a.getId().equals(id));
    }

    public long countByStatus(String status) {
        return store.appointments.stream().filter(a -> a.getStatus().equals(status)).count();
    }

    public long countToday() {
        String today = LocalDate.now().toString();
        return store.appointments.stream().filter(a -> a.getDate().equals(today)).count();
    }
}
