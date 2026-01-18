package com.example.Backend.production.entity;

import jakarta.persistence.*;
import lombok.Data;

import com.example.Backend.assets.entity.Asset;
import com.example.Backend.production.enums.PlanStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "production_plans")
public class ProductionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long planId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id",nullable = false)
    private Asset asset;

    private Double plannedVolume;
    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private PlanStatus status;

    private LocalDateTime createdAt = LocalDateTime.now();

    // getters & setters
}
