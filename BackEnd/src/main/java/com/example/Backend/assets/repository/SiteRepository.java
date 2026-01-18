package com.example.Backend.assets.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Backend.assets.entity.Site;

@Repository
public interface SiteRepository extends JpaRepository<Site, Long> {
}
