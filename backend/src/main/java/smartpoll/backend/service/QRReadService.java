package smartpoll.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import smartpoll.backend.dto.QRReadRequest;
import smartpoll.backend.dto.QRReadResponse;
import smartpoll.backend.dto.QRResponse;
import smartpoll.backend.entity.QRReadEventEntity;
import smartpoll.backend.entity.QrStatusEntity;
import smartpoll.backend.entity.VoterEntity;
import smartpoll.backend.exception.NotFoundException;
import smartpoll.backend.mapper.QRReadMapper;
import smartpoll.backend.repository.QRReadRepository;
import smartpoll.backend.repository.QRStatusRepository;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.data.domain.Pageable;

@Service
public class QRReadService {

    @Autowired
    QRReadRepository qrReadRepository;

    public void createQRRead(QRReadRequest qrReadRequest) {
        QRReadEventEntity qrReadEventEntity = new QRReadEventEntity();
        qrReadEventEntity.setCreatedAt(Instant.now());
        qrReadEventEntity.setQrScanStatus(qrReadRequest.qrScanStatus());
        qrReadRepository.save(qrReadEventEntity);
    }

    public Page<QRReadResponse> getAllAttempts(Pageable pageable) {
        Page<QRReadEventEntity> readAttempts = qrReadRepository.findAll(pageable);
        return readAttempts.map(QRReadMapper.INSTANCE::toDto);
    }
}
