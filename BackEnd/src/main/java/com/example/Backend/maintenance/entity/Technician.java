package com.example.Backend.maintenance.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "technicians")
public class Technician {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long technicianId;

    private String name;
    private String email;
    private String phone;
    private String skillLevel;
    private String status;

    // getters & setters
}
