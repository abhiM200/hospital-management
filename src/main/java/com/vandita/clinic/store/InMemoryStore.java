package com.vandita.clinic.store;

import com.vandita.clinic.model.*;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class InMemoryStore {

    // Appointments — ordered by creation
    public final List<Appointment> appointments = new CopyOnWriteArrayList<>();

    // Patients — keyed by phone number
    public final Map<String, Patient> patients = new ConcurrentHashMap<>();

    // Prescriptions
    public final List<Prescription> prescriptions = new CopyOnWriteArrayList<>();

    // Blog Posts
    public final List<BlogPost> blogPosts = new CopyOnWriteArrayList<>();

    // Blocked Slots: "2024-01-15|10:00 AM"
    public final Set<String> blockedSlots = ConcurrentHashMap.newKeySet();

    // Clinic Settings (single mutable instance)
    public volatile ClinicSettings settings = new ClinicSettings();

    // Admin PIN (mutable)
    public volatile String adminPin = "1234";
}
