package ch.hatbe2113.LimitCraftBackend.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.ArrayList;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationErrors(MethodArgumentNotValidException ex) {
        ArrayList<String> errors = new ArrayList<String>();

        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.add(fieldError.getDefaultMessage());
        }

        ErrorResponse errorResponse = new ErrorResponse("Validation failed", "INVALID_INPUT", errors);

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}
