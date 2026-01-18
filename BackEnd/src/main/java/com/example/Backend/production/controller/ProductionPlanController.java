package com.example.Backend.production.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.Backend.production.service.ProductionPlanService;
import com.example.Backend.production.entity.ProductionPlan;

import java.util.List;

@RestController
@RequestMapping("/api/production-plans")
public class ProductionPlanController {

    @Autowired
    private ProductionPlanService service;

    // CREATE
    @PostMapping
    public ProductionPlan createPlan(@RequestBody ProductionPlan plan) {
        return service.savePlan(plan);
    }

    // READ ALL
    @GetMapping
    public List<ProductionPlan> getAllPlans() {
        return service.getAllPlans();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ProductionPlan getPlanById(@PathVariable Long id) {
        return service.getPlanById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ProductionPlan updatePlan(
            @PathVariable Long id,
            @RequestBody ProductionPlan plan) {

        return service.updatePlan(id, plan);
    }
}
