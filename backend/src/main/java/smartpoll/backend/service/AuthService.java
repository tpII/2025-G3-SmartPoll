package smartpoll.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import smartpoll.backend.dto.VoterRequest;
import smartpoll.backend.dto.VoterResponse;
import smartpoll.backend.entity.VoterEntity;
import smartpoll.backend.exception.UserAlreadyExistsException;
import smartpoll.backend.mapper.VoterMapper;
import smartpoll.backend.repository.VoterRepository;

@Service
public class AuthService {

    @Autowired private VoterRepository voterRepository;
    @Autowired private JwtService jwtService;
    @Autowired private PasswordEncoder passwordEncoder;

    public VoterResponse signUp(VoterRequest request) {
        if(voterRepository.findByDNI(request.DNI()).isPresent()) {
            throw new UserAlreadyExistsException("DNI " + request.DNI() + " already exists.");
        }
        if(voterRepository.findByEmail(request.email()).isPresent()) {
            throw new UserAlreadyExistsException("Email " + request.email() + " already exists.");
        }

        VoterEntity voter = VoterMapper.INSTANCE.toEntity(request, passwordEncoder);
        voterRepository.save(voter);

        String token = jwtService.generateToken(voter.getEmail());
        return new VoterResponse(voter.getEmail(), voter.getDNI(), token);
    }
}
