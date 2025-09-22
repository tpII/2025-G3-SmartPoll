package smartpoll.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record QRRequest(
        @NotBlank UUID token
) {
}
