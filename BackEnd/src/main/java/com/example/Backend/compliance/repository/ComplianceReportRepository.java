package com.example.Backend.compliance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Backend.compliance.entity.ComplianceReport;

@Repository
public interface ComplianceReportRepository
        extends JpaRepository<ComplianceReport, Long> {
}
