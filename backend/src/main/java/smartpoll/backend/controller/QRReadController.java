package smartpoll.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import smartpoll.backend.dto.QRReadRequest;
import smartpoll.backend.dto.QRReadResponse;
import smartpoll.backend.service.QRReadService;

import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/qr-scan-attempt")
@Tag(name = "QR Scan Management", description = "APIs for QR scan")
public class QRReadController {

    @Autowired
    QRReadService qrReadService;
    
    @Operation(
            summary = "List QR scan attempts",
            description = """
        Returns a paginated list of QR scan attempts (QRReadEventEntity). 
        Supports filtering, sorting and pagination using Spring's Pageable.
        """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "Paginated list of QR scan events returned successfully"),
                    @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
            }
    )
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<QRReadResponse> listQRScanAttempts(Pageable pageable) {
        return qrReadService.getAllAttempts(pageable);
    }



}
