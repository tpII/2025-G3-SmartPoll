package smartpoll.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Deployment", description = "APIs for deployment")
public class HealthController {

    @Operation(
            summary = "Health check",
            description = "Verifies if the API is running and accessible.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "API is up and running",
                            content = @Content(
                                    mediaType = "text/plain",
                                    schema = @Schema(type = "string", example = "API is up")
                            )
                    )
            }
    )
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return new ResponseEntity<>("API is up", HttpStatus.OK);
    }
}