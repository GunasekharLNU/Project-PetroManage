package com.example.Backend.production.service;

import com.example.Backend.production.entity.ProductionPlan;
import com.example.Backend.production.repository.ProductionPlanRepository;
import com.example.Backend.assets.entity.Asset;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductionPlanService {

    @Autowired
    private ProductionPlanRepository repository;

    // CREATE
    public ProductionPlan savePlan(ProductionPlan plan) {
        return repository.save(plan);
    }

    // READ ALL
    public List<ProductionPlan> getAllPlans() {
        return repository.findAll();
    }

    // READ BY ID
    public ProductionPlan getPlanById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Production Plan not found with id: " + id));
    }

    // UPDATE
    public ProductionPlan updatePlan(Long id, ProductionPlan updatedPlan) {

        return repository.findById(id).map(plan -> {

            // 🔑 Asset handling (minimal & safe)
            plan.setAsset(updatedPlan.getAsset());

            plan.setPlannedVolume(updatedPlan.getPlannedVolume());
            plan.setStartDate(updatedPlan.getStartDate());
            plan.setEndDate(updatedPlan.getEndDate());
            plan.setStatus(updatedPlan.getStatus());

            return repository.save(plan);

        }).orElseThrow(() ->
                new RuntimeException("Production Plan not found with id: " + id));
    }
}
