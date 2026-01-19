package com.example.Backend.compliance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Backend.compliance.entity.ComplianceReport;
import com.example.Backend.compliance.repository.ComplianceReportRepository;

@Service
public class ComplianceReportService {

    @Autowired
    private ComplianceReportRepository repository;

    // SAVE FORM DATA
    public ComplianceReport saveReport(ComplianceReport report) {
        return repository.save(report);
    }

    // GET ALL REPORTS
    public List<ComplianceReport> getAllReports() {
        return repository.findAll();
    }

    // GET REPORT BY ID
    public ComplianceReport getReportById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Compliance report not found with id: " + id));
    }

    // UPDATE REPORT DATA
    // Logic inside ComplianceReportService.java
public ComplianceReport updateReport(Long id, ComplianceReport details) {
    return repository.findById(id).map(report -> {
        report.setComplianceStatus(details.getComplianceStatus());
        report.setSafetyScore(details.getSafetyScore());
        report.setInspector(details.getInspector());
        report.setNextAuditDate(details.getNextAuditDate());
        // Add any other fields you want to allow updates for
        return repository.save(report);
    }).orElseThrow(() -> new RuntimeException("Report not found with id " + id));
}

    // DELETE REPORT
    public void deleteReport(Long id) {
        // Verify it exists before trying to delete
        ComplianceReport report = getReportById(id);
        repository.delete(report);
    }
}