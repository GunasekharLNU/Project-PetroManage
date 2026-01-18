package com.example.Backend.assets.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.assets.entity.Asset;
import com.example.Backend.assets.service.AssetService;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin
public class AssetController {

    @Autowired
    private AssetService service;

    @PostMapping
    public Asset createAsset(@RequestBody Asset asset) {
        return service.saveAsset(asset);
    }

    @GetMapping
    public List<Asset> getAllAssets() {
        return service.getAllAssets();
    }

    @GetMapping("/{id}")
    public Asset getAssetById(@PathVariable Long id) {
        return service.getAssetById(id);
    }
}
