package smartpoll.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import smartpoll.backend.dto.QRResponse;
import smartpoll.backend.entity.VoterEntity;
import smartpoll.backend.service.QRService;

@RestController
@RequestMapping("/api/qr")
public class QRController {

    @Autowired QRService qrService;

    @GetMapping()
    public QRResponse generateQR(@AuthenticationPrincipal VoterEntity voter) {
        return qrService.generateQR(voter.getDNI());
    }
}
