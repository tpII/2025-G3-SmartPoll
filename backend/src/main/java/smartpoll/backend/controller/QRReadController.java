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
            summary = "Register a QR scan attempt",
            description = """
        Registers the result of a QR scan attempt. 
        This does NOT consume or invalidate a QR code — it only records 
        whether the scanned QR was correct, invalid, already used, or if a network/error occurred.
        """,
            responses = {
                    @ApiResponse(responseCode = "201", description = "QR scan event successfully recorded"),
                    @ApiResponse(responseCode = "400", description = "Invalid request format", content = @Content),
                    @ApiResponse(responseCode = "401", description = "Unauthorized - missing or invalid credentials", content = @Content)
            }
    )
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public void createQR(@RequestBody @Valid QRReadRequest qrReadRequest) {
        qrReadService.createQRRead(qrReadRequest);
    }



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
