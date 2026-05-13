package com.vandita.clinic.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimeSlot {
    private String time;
    private boolean available;
    private boolean blocked;
    private int booked;
    private int capacity;
}
