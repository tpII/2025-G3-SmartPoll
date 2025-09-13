package smartpoll.backend.dto;

import jakarta.validation.constraints.Positive;
import smartpoll.backend.validation.ValidEmail;
import smartpoll.backend.validation.ValidPassword;

public record VoterRequest(@ValidEmail String email,
                           @ValidPassword String password,
                           @Positive Long DNI) {
}
