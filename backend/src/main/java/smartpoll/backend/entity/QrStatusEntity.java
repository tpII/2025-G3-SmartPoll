package smartpoll.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Table(name = "qr-status")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class QrStatusEntity {
    @Id
    @GeneratedValue
    private UUID token;

    @OneToOne
    @JoinColumn(name = "voter_id", referencedColumnName = "id")
    private VoterEntity voter;

    @Column(nullable = false)
    private Boolean consumed = false;
}
