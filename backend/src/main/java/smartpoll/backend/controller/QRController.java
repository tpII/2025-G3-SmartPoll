package smartpoll.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import smartpoll.backend.dto.QRResponse;
import smartpoll.backend.entity.VoterEntity;
import smartpoll.backend.service.QRService;

import java.util.UUID;

@RestController
@RequestMapping("/api/qr")
@Tag(name = "QR Management", description = "APIs for QRs")
public class QRController {

    @Autowired QRService qrService;

    @Operation(
            summary = "Get QR for voter",
            description = "Creates and streams a QR code for the authenticated voter using Server-Sent Events (SSE).",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "QR generated successfully",
                            content = @Content(
                                    mediaType = MediaType.TEXT_EVENT_STREAM_VALUE,
                                    schema = @Schema(implementation = String.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "Unauthorized - missing or invalid credentials"
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "Token not found - QR already consumed"
                    )
            }
    )
    @GetMapping
    public SseEmitter generateQR(@AuthenticationPrincipal VoterEntity voter) {
        return qrService.generateQR(voter);
    }

    @Operation(
            summary = "Consume QR for voter",
            description = "Consumes a QR code identified by its token. Once consumed, it cannot be reused.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "QR was valid and successfully consumed"),
                    @ApiResponse(responseCode = "400", description = "Invalid token format - UUID is malformed", content = @Content),
                    @ApiResponse(responseCode = "401", description = "Unauthorized - missing or invalid credentials", content = @Content),
                    @ApiResponse(responseCode = "404", description = "Token not found - QR does not exist", content = @Content),
                    @ApiResponse(responseCode = "409", description = "Conflict - QR has already been consumed", content = @Content)
            }
    )
    @PostMapping("/consume/{token}")
    @ResponseStatus(HttpStatus.OK)
    public QRResponse consumeQR(@Valid @PathVariable UUID token) {
        return qrService.consumeQR(token);
    }
}
