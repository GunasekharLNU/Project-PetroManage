package com.example.Backend.auth.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.example.Backend.auth.enums.UserRole;
import com.example.Backend.assets.entity.Site;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(unique = true, nullable = false)
    private String username;

    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id")
    private Site site;

    private String status;
    private LocalDateTime createdAt = LocalDateTime.now();

    // getters & setters
}
