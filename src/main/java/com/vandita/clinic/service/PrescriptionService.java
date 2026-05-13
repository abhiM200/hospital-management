package com.vandita.clinic.service;

import com.vandita.clinic.model.Prescription;
import com.vandita.clinic.store.InMemoryStore;
import com.vandita.clinic.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    @Autowired private InMemoryStore store;
    @Autowired private IdGenerator idGen;

    public List<Prescription> findAll() {
        return store.prescriptions;
    }

    public Optional<Prescription> findById(String id) {
        return store.prescriptions.stream().filter(p -> p.getId().equals(id)).findFirst();
    }

    public List<Prescription> findByPhone(String phone) {
        return store.prescriptions.stream()
            .filter(p -> p.getPatientPhone().equals(phone))
            .collect(Collectors.toList());
    }

    public Prescription create(Prescription rx) {
        rx.setId(idGen.uuid());
        if (rx.getDate() == null) rx.setDate(LocalDate.now().toString());
        store.prescriptions.add(rx);
        return rx;
    }

    public boolean delete(String id) {
        return store.prescriptions.removeIf(p -> p.getId().equals(id));
    }
}
