package smartpoll.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import smartpoll.backend.dto.QRResponse;
import smartpoll.backend.entity.QrStatusEntity;
import smartpoll.backend.entity.VoterEntity;
import smartpoll.backend.exception.NotFoundException;
import smartpoll.backend.repository.QRStatusRepository;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class QRService {

    @Autowired
    QRStatusRepository qrStatusRepository;

    private final ExecutorService executor = Executors.newCachedThreadPool();

    public SseEmitter generateQR(VoterEntity voter) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        executor.execute(() -> {
            try {
                String lastStatus = null;
                UUID token = getOrCreateQR(voter);

                while (true) {
                    Thread.sleep(1000);

                    Optional<QrStatusEntity> qrOpt = qrStatusRepository.findByToken(token);
                    if (qrOpt.isEmpty()) {
                        throw new NotFoundException("QR not found");
                    }

                    QrStatusEntity qrStatus = qrOpt.get();
                    String currentStatus = qrStatus.getConsumed() ? "scanned" : "waiting";

                    if (!currentStatus.equals(lastStatus)) {
                        emitter.send(SseEmitter.event()
                                .name("qrStatus")
                                .data(Map.of("status", currentStatus, "token", token)));
                        lastStatus = currentStatus;
                    }

                    if (qrStatus.getConsumed()) {
                        emitter.complete();
                        break;
                    }
                }

            } catch (IOException | InterruptedException e) {
                emitter.completeWithError(e);
            } catch (NotFoundException ex) {
                try {
                    emitter.send(SseEmitter.event()
                            .name("qrStatus")
                            .data(Map.of("status", "scanned")));
                } catch (IOException ignored) {
                }
                emitter.complete();
            }
        });

        return emitter;
    }

    private UUID getOrCreateQR(VoterEntity voter) {
        Optional<QrStatusEntity> qrStatusEntity = qrStatusRepository.findByVoter(voter);
        if (qrStatusEntity.isEmpty()) {
            QrStatusEntity qrStatus = new QrStatusEntity();
            qrStatus.setVoter(voter);
            qrStatus = qrStatusRepository.save(qrStatus);
            return qrStatus.getToken();
        }
        QrStatusEntity qrStatus = qrStatusEntity.get();
        if (qrStatus.getConsumed()) {
            throw new NotFoundException("Consumed QR");
        }
        return qrStatus.getToken();
    }

    public QRResponse consumeQR(UUID token) {
        QrStatusEntity qrStatusEntity = qrStatusRepository.findByToken(token)
                .orElseThrow(() -> new NotFoundException("Invalid token"));

        if (qrStatusEntity.getConsumed()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "QR has already been consumed");
        }

        qrStatusEntity.setConsumed(true);
        qrStatusRepository.save(qrStatusEntity);
        return null;
    }
}
