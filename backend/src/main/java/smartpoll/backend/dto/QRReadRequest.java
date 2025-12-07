package smartpoll.backend.dto;

import jakarta.validation.constraints.NotNull;
import smartpoll.backend.entity.QRReadEventEntity;

public record QRReadRequest(
        @NotNull(message = "qrScanStatus is required")
        QRReadEventEntity.QRScanStatus qrScanStatus
) {
}
