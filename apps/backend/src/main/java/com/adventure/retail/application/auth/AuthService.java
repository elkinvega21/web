package com.adventure.retail.application.auth;

import com.adventure.retail.application.exception.InvalidCredentialsException;
import com.adventure.retail.application.exception.NotFoundException;
import com.adventure.retail.domain.user.User;
import com.adventure.retail.domain.user.UserRepository;
import com.adventure.retail.infrastructure.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public AuthResult login(String email, String password) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .filter(User::isEnabled)
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRoles());
        return new AuthResult(token, user);
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
    }

    public record AuthResult(String token, User user) {
    }
}
