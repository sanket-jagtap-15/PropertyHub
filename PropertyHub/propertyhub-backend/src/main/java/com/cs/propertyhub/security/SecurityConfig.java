
package com.cs.propertyhub.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // Public admin login endpoint
                .requestMatchers("/api/auth/**").permitAll()

                // Allow CORS preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Anyone can view properties
                .requestMatchers(HttpMethod.GET, "/api/properties/**").permitAll()

                // Only admin can manage properties
                .requestMatchers(HttpMethod.POST, "/api/properties/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/properties/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/properties/**").hasRole("ADMIN")

                // Anyone can submit a customer enquiry
                .requestMatchers(HttpMethod.POST, "/api/enquiries").permitAll()

                // Only admin can view customer enquiries
                .requestMatchers(HttpMethod.GET, "/api/enquiries").hasRole("ADMIN")

                // Only admin can delete customer enquiries
                .requestMatchers(HttpMethod.DELETE, "/api/enquiries/**").hasRole("ADMIN")

                // Reject all other requests
                .anyRequest().denyAll()
            )
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "https://propertyhubsj.netlify.app"
        ));

        configuration.setAllowedMethods(
            List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
