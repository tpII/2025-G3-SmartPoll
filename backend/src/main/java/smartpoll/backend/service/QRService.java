package smartpoll.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smartpoll.backend.dto.QRResponse;

@Service
public class QRService {

    @Autowired JwtService jwtService;

    public QRResponse generateQR(Long DNI) {
        String token = jwtService.generateQrToken(DNI);
        return new QRResponse(token);
    }
}
