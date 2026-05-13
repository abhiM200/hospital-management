package com.vandita.clinic.service;

import com.vandita.clinic.model.Appointment;
import com.vandita.clinic.model.Patient;
import com.vandita.clinic.store.InMemoryStore;
import com.vandita.clinic.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired private InMemoryStore store;
    @Autowired private IdGenerator idGen;

    public Collection<Patient> findAll() {
        return store.patients.values();
    }

    public Optional<Patient> findByPhone(String phone) {
        return Optional.ofNullable(store.patients.get(phone));
    }

    public Patient update(String phone, Patient updated) {
        Patient existing = store.patients.getOrDefault(phone, updated);
        existing.setName(updated.getName());
        existing.setAge(updated.getAge());
        existing.setGender(updated.getGender());
        existing.setEmail(updated.getEmail());
        store.patients.put(phone, existing);
        return existing;
    }

    public void upsertFromAppointment(Appointment appt) {
        store.patients.merge(appt.getPhone(),
            Patient.builder()
                .id(idGen.uuid())
                .name(appt.getPatientName())
                .phone(appt.getPhone())
                .age(appt.getAge())
                .gender(appt.getGender())
                .email(appt.getEmail() != null ? appt.getEmail() : "")
                .registeredAt(LocalDate.now().toString())
                .lastVisit(appt.getDate())
                .visitCount(1)
                .build(),
            (existing, newP) -> {
                existing.setVisitCount(existing.getVisitCount() + 1);
                existing.setLastVisit(appt.getDate());
                return existing;
            }
        );
    }
}
