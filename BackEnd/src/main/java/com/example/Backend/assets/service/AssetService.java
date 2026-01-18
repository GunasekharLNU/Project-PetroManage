package com.example.Backend.assets.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Backend.assets.entity.Asset;
import com.example.Backend.assets.repository.AssetRepository;

@Service
public class AssetService {

    @Autowired
    private AssetRepository repository;

    public Asset saveAsset(Asset asset) {
        return repository.save(asset);
    }

    public List<Asset> getAllAssets() {
        return repository.findAll();
    }

    public Asset getAssetById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Asset not found with id: " + id));
    }
}
