package com.example.Backend.compliance.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Backend.compliance.entity.ComplianceReport;
import com.example.Backend.compliance.service.ComplianceReportService;

@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})@RestController
@RequestMapping("/api/compliance-reports")
public class ComplianceReportController {

    @Autowired
    private ComplianceReportService service;

    // CREATE: Save a new report
    @PostMapping
    public ComplianceReport submitReport(@RequestBody ComplianceReport report) {
        return service.saveReport(report);
    }

    // READ: Get all reports
    @GetMapping
    public List<ComplianceReport> getAllReports() {
        return service.getAllReports();
    }

    // READ: Get report by ID
    @GetMapping("/{id}")
    public ComplianceReport getReportById(@PathVariable Long id) {
        return service.getReportById(id);
    }

    // UPDATE: Update an existing report
    @PutMapping("/{id}")
    public ResponseEntity<ComplianceReport> updateReport(@PathVariable Long id, @RequestBody ComplianceReport reportDetails) {
        ComplianceReport updatedReport = service.updateReport(id, reportDetails);
        return ResponseEntity.ok(updatedReport);
    }

    // DELETE: Remove a report from the database
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        service.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}