package com.vandita.clinic.controller;

import com.vandita.clinic.model.Appointment;
import com.vandita.clinic.service.AppointmentService;
import com.vandita.clinic.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientService patientService;

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalAppointments", appointmentService.findAll().size());
        summary.put("pendingAppointments", appointmentService.countByStatus("pending"));
        summary.put("confirmedAppointments", appointmentService.countByStatus("confirmed"));
        summary.put("todayAppointments", appointmentService.countToday());
        summary.put("totalPatients", patientService.findAll().size());
        return summary;
    }

    @GetMapping("/appointments-by-day")
    public List<Map<String, Object>> getAppointmentsByDay() {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(30);
        
        Map<String, Long> counts = appointmentService.findAll().stream()
                .filter(a -> {
                    LocalDate d = LocalDate.parse(a.getDate());
                    return !d.isBefore(start) && !d.isAfter(end);
                })
                .collect(Collectors.groupingBy(Appointment::getDate, Collectors.counting()));
        
        return start.datesUntil(end.plusDays(1))
                .map(d -> {
                    String ds = d.toString();
                    return Map.of("date", ds, "count", counts.getOrDefault(ds, 0L));
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/by-treatment")
    public List<Map<String, Object>> getByTreatment() {
        // Since we don't have a treatment field in Appointment model yet, we'll infer from symptoms or just dummy data
        // For a real app, you'd add a 'category' field to Appointment.
        return List.of(
            Map.of("label", "Skin", "value", 25),
            Map.of("label", "Hormonal", "value", 15),
            Map.of("label", "Migraine", "value", 20),
            Map.of("label", "Pediatric", "value", 10),
            Map.of("label", "Other", "value", 30)
        );
    }

    @GetMapping("/by-type")
    public List<Map<String, Object>> getByType() {
        Map<String, Long> counts = appointmentService.findAll().stream()
                .collect(Collectors.groupingBy(Appointment::getConsultationType, Collectors.counting()));
        
        return counts.entrySet().stream()
                .map(e -> Map.of("label", e.getKey(), "value", e.getValue()))
                .collect(Collectors.toList());
    }
}
