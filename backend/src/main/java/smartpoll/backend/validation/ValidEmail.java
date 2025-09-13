package smartpoll.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = {})
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@NotBlank(message = "Email is required")@NotBlank(message = "Email is required")
@Email(message = "Invalid email format")
public @interface ValidEmail {
    String message() default "Invalid email";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
