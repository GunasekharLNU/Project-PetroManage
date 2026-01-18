package com.example.Backend.production.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Backend.production.entity.ProductionPlan;

@Repository
public interface ProductionPlanRepository extends JpaRepository<ProductionPlan, Long> {
}
