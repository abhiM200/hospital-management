package com.vandita.clinic.controller;

import com.vandita.clinic.model.Appointment;
import com.vandita.clinic.service.AppointmentService;
import com.vandita.clinic.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
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
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("date", ds);
                    entry.put("count", counts.getOrDefault(ds, 0L));
                    return entry;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/by-treatment")
    public List<Map<String, Object>> getByTreatment() {
        List<Map<String, Object>> result = new ArrayList<>();

        String[] labels = {"Skin", "Hormonal", "Migraine", "Pediatric", "Other"};
        int[] values = {25, 15, 20, 10, 30};

        for (int i = 0; i < labels.length; i++) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("label", labels[i]);
            entry.put("value", values[i]);
            result.add(entry);
        }
        return result;
    }

    @GetMapping("/by-type")
    public List<Map<String, Object>> getByType() {
        Map<String, Long> counts = appointmentService.findAll().stream()
                .collect(Collectors.groupingBy(Appointment::getConsultationType, Collectors.counting()));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Long> e : counts.entrySet()) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("label", e.getKey());
            entry.put("value", e.getValue());
            result.add(entry);
        }
        return result;
    }
}
