package com.example.Backend.analytics.entity;
import com.example.Backend.assets.entity.Asset;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "analytics_reports")
public class AnalyticsReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id")
    private Asset asset;

    private Double productionEfficiency;
    private Double downtimeHours;
    private LocalDate generatedDate;

    // getters & setters
}
