package com.example.Backend.compliance.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.Backend.compliance.service.AuditService;
import com.example.Backend.compliance.entity.Audit;
import java.util.List;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/audits")
@CrossOrigin(origins = "*")
public class AuditController {
    @Autowired
    private AuditService auditService;

    @GetMapping
    public List<Audit> getAllAudits() {
        return auditService.getAllAudits();
    }

    @PostMapping
    public Audit createAudit(@RequestBody Audit audit) {
        return auditService.createAudit(audit);
    }

    @DeleteMapping
    public void deleteAllAudits() {
        auditService.deleteAllAudits();
    }
}