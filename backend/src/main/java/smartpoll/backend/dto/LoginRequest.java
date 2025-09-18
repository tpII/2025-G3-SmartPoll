package smartpoll.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest (
    @NotBlank String identifier,
    @NotBlank String password)
{ }