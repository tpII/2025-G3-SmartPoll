package smartpoll.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import smartpoll.backend.validation.ValidEmail;

public record AuthResponse(@ValidEmail String email,
                           @Positive Long DNI,
                           @NotBlank String token) {
}
