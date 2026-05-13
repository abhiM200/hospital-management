package com.vandita.clinic.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {
    private String id;
    private String appointmentId;
    private String patientName;
    private String patientPhone;
    private int patientAge;
    private String patientGender;
    private String date;
    private List<Medicine> medicines;
    private String advice;
    private String followUpDate;
    private String doctorNote;
}
