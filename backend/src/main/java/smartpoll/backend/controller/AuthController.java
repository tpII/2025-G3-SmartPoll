package smartpoll.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import smartpoll.backend.dto.LoginRequest;
import smartpoll.backend.dto.VoterRequest;
import smartpoll.backend.dto.AuthResponse;
import smartpoll.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "User Management", description = "APIs for managing users")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Operation(
            summary = "Register a new user",
            description = "Creates a new user account with username, email, and password.",
            responses = {
                    @ApiResponse(
                            responseCode = "201",
                            description = "User successfully registered",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = AuthResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Validation failed for one or more fields",
                            content = @Content
                    ),
                    @ApiResponse(
                            responseCode = "409",
                            description = "Email or DNI already registered",
                            content = @Content
                    )
            }
    )
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse signUp(@Valid @RequestBody VoterRequest request) {
        return authService.signUp(request);
    }

    @Operation(
            summary = "Login a user",
            description = "Authenticates a user using email/dni and password.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = LoginRequest.class),
                            examples = @ExampleObject(
                                    name = "LoginRequest"
                            )
                    )
            ),
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successful login"
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "Invalid input data",
                            content = @Content
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "Bad credentials",
                            content = @Content
                    )
            }
    )
    @PostMapping(path = "/signin")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

}
