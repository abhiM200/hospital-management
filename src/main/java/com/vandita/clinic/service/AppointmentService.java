package com.vandita.clinic.service;

import com.vandita.clinic.model.Appointment;
import com.vandita.clinic.store.InMemoryStore;
import com.vandita.clinic.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    public Appointment create(Appointment appt) {
        appt.setId(idGen.uuid());
        appt.setStatus("pending");
        appt.setCreatedAt(LocalDate.now().toString());
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
