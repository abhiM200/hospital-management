package com.vandita.clinic.controller;

import com.vandita.clinic.model.Appointment;
import com.vandita.clinic.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public List<Appointment> getAll() {
        return appointmentService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getById(@PathVariable String id) {
        return appointmentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/phone/{phone}")
    public List<Appointment> getByPhone(@PathVariable String phone) {
        return appointmentService.findByPhone(phone);
    }

    @GetMapping("/date/{date}")
    public List<Appointment> getByDate(@PathVariable String date) {
        return appointmentService.findByDate(date);
    }

    @PostMapping
    public ResponseEntity<?> book(@RequestBody Appointment appointment) {
        try {
            Appointment created = appointmentService.create(appointment);
            return ResponseEntity.ok(created);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to book appointment. Please try again."));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable String id, @RequestBody Map<String, String> statusMap) {
        String status = statusMap.get("status");
        return appointmentService.updateStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable String id) {
        if (appointmentService.delete(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
