package com.example.Backend.compliance.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.Backend.compliance.entity.Audit;
import java.util.*;
import com.example.Backend.compliance.entity.ComplianceReport

@Repository
public interface AuditRepository extends JpaRepository<Audit, Long> {
    List<Audit> findByComplianceReport(ComplianceReport report);
}