package smartpoll.backend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import smartpoll.backend.dto.QRResponse;
import smartpoll.backend.entity.VoterEntity;
import smartpoll.backend.service.QRService;

import java.util.UUID;

@RestController
@RequestMapping("/api/qr")
public class QRController {

    @Autowired QRService qrService;

    @GetMapping
    public SseEmitter generateQR(@AuthenticationPrincipal VoterEntity voter) {
        return qrService.generateQR(voter);
    }

    @PostMapping("/consume/{token}")
    @ResponseStatus(HttpStatus.OK)
    public QRResponse consumeQR(@Valid @PathVariable UUID token) {
        return qrService.consumeQR(token);
    }
}
