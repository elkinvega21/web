package com.adventure.retail.infrastructure.config;

import com.adventure.retail.domain.user.User;
import com.adventure.retail.domain.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;
    private final String adminName;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           @Value("${app.admin.email:admin@adventureretail.com}") String adminEmail,
                           @Value("${app.admin.password:Admin2025!}") String adminPassword,
                           @Value("${app.admin.name:Laura Restrepo}") String adminName) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.adminName = adminName;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.create(
                    adminEmail,
                    passwordEncoder.encode(adminPassword),
                    adminName,
                    Set.of("ROLE_ADMIN"));
            userRepository.save(admin);
            log.info("Usuario administrador por defecto creado: {}", adminEmail);
        }
    }
}
