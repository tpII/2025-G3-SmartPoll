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
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import java.util.Optional;
import java.util.UUID;

@Service
public class QRService {

    @Autowired QRStatusRepository qrStatusRepository;
    private final ExecutorService executor = Executors.newCachedThreadPool();

    public SseEmitter generateQR(VoterEntity voter) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        executor.execute(() -> {
            try {
                while (true) {
                    Thread.sleep(1000);
                    emitter.send(SseEmitter.event()
                            .name("qrStatus")
                            .data(Map.of("status", "waiting", "token", getQRFromVoter(voter))));
                }
            } catch (NotFoundException ex) {
                try {
                    emitter.send(SseEmitter.event()
                            .name("qrStatus")
                            .data(Map.of("status", "scanned")));
                } catch (IOException ignored) {
                }
                emitter.complete();
            } catch (IOException | InterruptedException e) {
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }

    private UUID getQRFromVoter(VoterEntity voter) {
        Optional<QrStatusEntity> qrStatusEntity = qrStatusRepository.findByVoter(voter);
        if (qrStatusEntity.isEmpty()) {
            QrStatusEntity qrStatus = new QrStatusEntity();
            qrStatus.setVoter(voter);
            qrStatus = qrStatusRepository.save(qrStatus);
            return qrStatus.getToken();
        }
        QrStatusEntity qrStatus = qrStatusEntity.get();
        if(qrStatus.getConsumed()) {
            throw new NotFoundException("Consumed QR");
        }
        return qrStatus.getToken();
    }

    public QRResponse consumeQR(UUID token) {
        QrStatusEntity qrStatusEntity = qrStatusRepository.findByToken(token).orElseThrow(() -> new NotFoundException("Invalid token"));
        if(qrStatusEntity.getConsumed()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "QR has already been consumed");
        }
        qrStatusEntity.setConsumed(true);
        qrStatusRepository.save(qrStatusEntity);
        return null;
    }
}
