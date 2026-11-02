
package com.cs.propertyhub.security;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminUserDetailsService implements UserDetailsService {

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    private final PasswordEncoder passwordEncoder;

    private String encodedPassword;

    public AdminUserDetailsService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void initializePassword() {
        if (adminPassword == null || adminPassword.isBlank()) {
            throw new IllegalStateException(
                "Set the ADMIN_PASSWORD environment variable first.");
        }

        encodedPassword = passwordEncoder.encode(adminPassword);
    }

    @Override
    public UserDetails loadUserByUsername(String username) {

        if (!adminUsername.equalsIgnoreCase(username)) {
            throw new UsernameNotFoundException("Admin user not found");
        }

        return User.builder()
                .username(adminUsername)
                .password(encodedPassword)
                .roles("ADMIN")
                .build();
    }
}
