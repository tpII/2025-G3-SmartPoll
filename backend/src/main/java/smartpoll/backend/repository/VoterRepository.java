package smartpoll.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import smartpoll.backend.entity.VoterEntity;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VoterRepository extends CrudRepository<VoterEntity, UUID> {
    Optional<VoterEntity> findByEmail(String email);

    Optional<VoterEntity> findByDNI(Long dni);
}