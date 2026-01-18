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
public ComplianceReport updateReport(Long id, ComplianceReport reportDetails) {
    ComplianceReport existing = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Report not found"));
        
    // Manual mapping ensures we don't accidentally overwrite the Asset relation
    existing.setSafetyScore(reportDetails.getSafetyScore());
    existing.setComplianceStatus(reportDetails.getComplianceStatus());
    
    return repository.save(existing);
}

    // DELETE REPORT
    public void deleteReport(Long id) {
        // Verify it exists before trying to delete
        ComplianceReport report = getReportById(id);
        repository.delete(report);
    }
}