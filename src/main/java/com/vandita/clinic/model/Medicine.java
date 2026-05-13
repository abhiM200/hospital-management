package com.vandita.clinic.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Medicine {
    private String name;
    private String potency;
    private String dose;
    private String frequency;
    private String duration;
}
