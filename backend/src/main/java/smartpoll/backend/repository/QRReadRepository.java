package smartpoll.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import smartpoll.backend.entity.QRReadEventEntity;

import java.util.UUID;

public interface QRReadRepository extends JpaRepository<QRReadEventEntity, UUID> {
    Page<QRReadEventEntity> findAll(Pageable pageable);

}
