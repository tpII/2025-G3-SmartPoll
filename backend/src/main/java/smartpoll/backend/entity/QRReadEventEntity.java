package smartpoll.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Table(name = "qr-attempts")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class QRReadEventEntity {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public enum QRScanStatus {
        SUCCESS,
        INVALID_QR,
        ALREADY_USED,
        NETWORK_ERROR,
        UNKNOWN_ERROR
    }

    @Enumerated(EnumType.STRING)
    private QRScanStatus qrScanStatus;

}
