package com.vandita.clinic.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    private String id;
    private String name;
    private String phone;
    private int age;
    private String gender;
    private String registeredAt;
    private int visitCount;
    private String email;
    private String lastVisit;
}
