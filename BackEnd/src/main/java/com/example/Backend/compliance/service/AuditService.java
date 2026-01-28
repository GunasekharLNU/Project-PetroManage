package com.example.Backend.compliance.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.Backend.compliance.repository.AuditRepository;
import com.example.Backend.compliance.repository.ComplianceReportRepository; // Add this
import com.example.Backend.compliance.entity.Audit;
import com.example.Backend.compliance.entity.ComplianceReport;
import java.util.List;

@Service
public class AuditService {
    
    @Autowired
    private AuditRepository auditRepository;

    @Autowired
    private ComplianceReportRepository reportRepository; // Add this to find existing reports

    public List<Audit> getAllAudits() {
        return auditRepository.findAll();
    }

    public Audit createAudit(Audit audit) {
        // Check if the audit has a compliance report reference
        if (audit.getComplianceReport() != null && audit.getComplianceReport().getReportId() != null) {
            
            // Fetch the existing report from DB. This report already has its asset_id and assetName.
            ComplianceReport existingReport = reportRepository.findById(audit.getComplianceReport().getReportId())
                .orElseThrow(() -> new RuntimeException("Compliance Report not found with ID: " + audit.getComplianceReport().getReportId()));
            
            // Link the audit to the existing database record
            audit.setComplianceReport(existingReport);
        }
        
        return auditRepository.save(audit);
    }

    public void deleteAllAudits() {
        auditRepository.deleteAll();
    }
}