package smartpoll.backend.repository;

import org.springframework.data.repository.CrudRepository;
import smartpoll.backend.entity.QrStatusEntity;
import smartpoll.backend.entity.VoterEntity;

import java.util.Optional;
import java.util.UUID;

public interface QRStatusRepository extends CrudRepository<QrStatusEntity, UUID> {
    Optional<QrStatusEntity> findByVoterId(UUID id);

    Optional<QrStatusEntity> findByToken(UUID token);

    Optional<QrStatusEntity> findByVoter(VoterEntity voter);
}
