package smartpoll.backend.dto;

import jakarta.validation.constraints.NotBlank;
import smartpoll.backend.entity.QRReadEventEntity;

import java.time.Instant;

public record QRReadResponse(
        @NotBlank
        Instant createdAt,
        @NotBlank
        QRReadEventEntity.QRScanStatus qrScanStatus
) {
}
