package com.vandita.clinic.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ClinicSettings {
    private String clinicName = "Dr. Vandita's Homeopathy Clinic";
    private String doctorName = "Dr. Vandita";
    private String qualification = "B.H.M.S Homeopathic Physician & Consultant";
    private String phone = "7005574327";
    private String whatsapp = "7005574327";
    private String address = "Padri Bazar, Mohanapur, Gorakhpur, UP - 273014";
    private String landmark = "Opposite Yadav Kiryana Store";
    private String email = "drvandita@clinic.in";
    private int consultationFee = 200;
    private String workingDays = "Mon,Tue,Wed,Thu,Fri,Sat";
    private String morningStart = "09:00";
    private String morningEnd = "13:00";
    private String eveningStart = "16:00";
    private String eveningEnd = "20:00";
    private int slotDurationMinutes = 30;
    private int maxPatientsPerDay = 20;
    private List<String> holidayDates = new ArrayList<>();
    private String aboutText = "Dr. Vandita is a qualified B.H.M.S Homeopathic Physician " +
            "with over 10 years of experience treating chronic and acute conditions " +
            "using classical homeopathy. She believes in holistic healing that addresses " +
            "the root cause of disease rather than suppressing symptoms.";
}
