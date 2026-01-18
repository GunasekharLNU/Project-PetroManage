package com.example.Backend.assets.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Backend.assets.entity.Asset;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
}
