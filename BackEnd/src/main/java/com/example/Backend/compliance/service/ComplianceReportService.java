package com.example.Backend.compliance.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Backend.compliance.entity.ComplianceReport;
import com.example.Backend.compliance.entity.Audit;
import com.example.Backend.compliance.repository.ComplianceReportRepository;
import com.example.Backend.compliance.repository.AuditRepository; // Ensure this is imported

@Service
public class ComplianceReportService {

    @Autowired
    private ComplianceReportRepository repository;

    @Autowired
    private AuditService auditService;

    @Autowired
    private AuditRepository auditRepository; // Added to handle unlinking existing logs

    @Transactional
    public ComplianceReport saveReport(ComplianceReport report) {
        ComplianceReport savedReport = repository.save(report);
        String newVal = "Status: " + savedReport.getComplianceStatus() + ", Score: " + savedReport.getSafetyScore();
        String user = savedReport.getInspector(); 
        
        logAudit(savedReport, "CREATE", "NONE", newVal, user);
        return savedReport;
    }

    public List<ComplianceReport> getAllReports() {
        return repository.findAll();
    }

    public ComplianceReport getReportById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compliance report not found with id: " + id));
    }

    @Transactional
    public ComplianceReport updateReport(Long id, ComplianceReport details) {
        return repository.findById(id).map(report -> {
            String oldStatus = String.valueOf(report.getComplianceStatus());
            Integer oldScore = report.getSafetyScore();
            boolean changed = false;

            if (details.getComplianceStatus() != null && 
                !details.getComplianceStatus().equals(report.getComplianceStatus())) {
                report.setComplianceStatus(details.getComplianceStatus());
                changed = true;
            }

            if (details.getSafetyScore() != null && 
                !details.getSafetyScore().equals(report.getSafetyScore())) {
                report.setSafetyScore(details.getSafetyScore());
                changed = true;
            }

            if (details.getInspector() != null) report.setInspector(details.getInspector());
            if (details.getNextAuditDate() != null) report.setNextAuditDate(details.getNextAuditDate());
            
            String user = details.getInspector() != null ? details.getInspector() : report.getInspector();
            ComplianceReport updated = repository.save(report);

            if (changed) {
                String fullOldVal = "Status: " + oldStatus + ", Score: " + oldScore;
                String fullNewVal = "Status: " + updated.getComplianceStatus() + ", Score: " + updated.getSafetyScore();
                logAudit(updated, "UPDATE", fullOldVal, fullNewVal, user);
            }
            
            return updated;
        }).orElseThrow(() -> new RuntimeException("Report not found with id " + id));
    }

    @Transactional
    public void deleteReport(Long id) {
        ComplianceReport report = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with id " + id));

        // --- STEP 1: PRESERVE OLD AUDITS ---
        // Find all existing audits linked to this report and unlink them
        List<Audit> existingAudits = auditRepository.findByComplianceReport(report);
        for (Audit a : existingAudits) {
            a.setComplianceReport(null); // Remove the link to the report
        }
        auditRepository.saveAll(existingAudits); // Save them as "orphans"

        // --- STEP 2: LOG THE DELETION EVENT ---
        Audit deleteLog = new Audit();
        deleteLog.setAction("DELETE");
        deleteLog.setOldValue("Status: " + report.getComplianceStatus() + ", Score: " + report.getSafetyScore());
        deleteLog.setNewValue("NONE");
        deleteLog.setUser(report.getInspector());
        deleteLog.setReportIdDisplay(id); // Use the current ID for display
        deleteLog.setComplianceReport(null); // Ensure this new log isn't linked to a report being deleted
        
        auditService.createAudit(deleteLog);

        // --- STEP 3: DELETE THE REPORT ---
        repository.delete(report);
    }

    private void logAudit(ComplianceReport report, String action, String oldVal, String newVal, String user) {
        Audit audit = new Audit();
        audit.setComplianceReport(report);
        audit.setReportIdDisplay(report.getReportId());
        audit.setAction(action);
        audit.setOldValue(oldVal);
        audit.setNewValue(newVal);
        audit.setUser(user);
        auditService.createAudit(audit);
    }
}