package com.vandita.clinic.controller;

import com.vandita.clinic.model.Patient;
import com.vandita.clinic.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping
    public Collection<Patient> getAll() {
        return patientService.findAll();
    }

    @GetMapping("/{phone}")
    public ResponseEntity<Patient> getByPhone(@PathVariable String phone) {
        return patientService.findByPhone(phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{phone}")
    public Patient update(@PathVariable String phone, @RequestBody Patient patient) {
        return patientService.update(phone, patient);
    }
}
