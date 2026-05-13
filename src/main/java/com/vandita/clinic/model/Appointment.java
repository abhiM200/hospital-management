package com.vandita.clinic.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    private String id;
    private String patientName;
    private String phone;
    private int age;
    private String gender;          // male/female/other
    private String date;            // YYYY-MM-DD
    private String slot;            // "10:00 AM"
    private String consultationType;// in-person/video
    private String symptoms;
    private String status;          // pending/confirmed/completed/cancelled
    private String createdAt;
    private String email;
}
