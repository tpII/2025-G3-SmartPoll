package smartpoll.backend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import smartpoll.backend.dto.VoterRequest;
import smartpoll.backend.dto.VoterResponse;
import smartpoll.backend.service.AuthService;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public VoterResponse signUp(@Valid @RequestBody VoterRequest request) {
        return authService.signUp(request);
    }

}
