package smartpoll.backend.service;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import smartpoll.backend.dto.LoginRequest;
import smartpoll.backend.dto.VoterRequest;
import smartpoll.backend.dto.AuthResponse;
import smartpoll.backend.entity.VoterEntity;
import smartpoll.backend.exception.NotFoundException;
import smartpoll.backend.exception.UserAlreadyExistsException;
import smartpoll.backend.mapper.VoterMapper;
import smartpoll.backend.repository.VoterRepository;

import java.util.regex.Pattern;

@Service
public class AuthService {

    @Autowired private VoterRepository voterRepository;
    @Autowired private JwtService jwtService;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;

    public AuthResponse signUp(VoterRequest request) {
        if(voterRepository.findByDNI(request.DNI()).isPresent()) {
            throw new UserAlreadyExistsException("DNI " + request.DNI() + " already exists.");
        }
        if(voterRepository.findByEmail(request.email()).isPresent()) {
            throw new UserAlreadyExistsException("Email " + request.email() + " already exists.");
        }

        VoterEntity voter = VoterMapper.INSTANCE.toEntity(request, passwordEncoder);
        voterRepository.save(voter);

        String token = jwtService.generateToken(voter.getEmail());
        return new AuthResponse(voter.getEmail(), voter.getDNI(), token);
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.identifier();
        String email;

        if(isEmail(identifier)) email = identifier;
        else if(isDni(identifier)) {
            Long DNI = Long.parseLong(identifier);
            VoterEntity voter = voterRepository.findByDNI(DNI).orElseThrow(() -> new NotFoundException("User with DNI " + DNI + " not found."));
            email = voter.getEmail();
        } else throw new IllegalArgumentException("Invalid email or dni.");

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password())
        );

        VoterEntity user = voterRepository.findByEmail(email).orElseThrow();
        String token = jwtService.generateToken(email);
        return new AuthResponse(user.getEmail(), user.getDNI(), token);
    }

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    private boolean isEmail(String identifier) {
        return identifier != null && EMAIL_PATTERN.matcher(identifier).matches();
    }

    private boolean isDni(String identifier) {
        return identifier != null && identifier.matches("\\d+");
    }

}
