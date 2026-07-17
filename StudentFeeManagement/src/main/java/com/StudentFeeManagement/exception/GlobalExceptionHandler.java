package com.StudentFeeManagement.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.StudentFeeManagement.util.ResponseStructure;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AdminNotFoundException.class)
    public ResponseEntity<ResponseStructure<Object>> handleAdminNotFound(
            AdminNotFoundException ex) {

        ResponseStructure<Object> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.NOT_FOUND.value());
        response.setMessage(ex.getMessage());
        response.setData(null);
        response.setErrors(null);

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(StudentNotFoundException.class)
    public ResponseEntity<ResponseStructure<Object>> handleStudentNotFound(
            StudentNotFoundException ex) {

        ResponseStructure<Object> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.NOT_FOUND.value());
        response.setMessage(ex.getMessage());
        response.setData(null);
        response.setErrors(null);

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(CourseNotFoundException.class)
    public ResponseEntity<ResponseStructure<Object>> handleCourseNotFound(
            CourseNotFoundException ex) {

        ResponseStructure<Object> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.NOT_FOUND.value());
        response.setMessage(ex.getMessage());
        response.setData(null);
        response.setErrors(null);

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(FeeNotFoundException.class)
    public ResponseEntity<ResponseStructure<Object>> handleFeeNotFound(
            FeeNotFoundException ex) {

        ResponseStructure<Object> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.NOT_FOUND.value());
        response.setMessage(ex.getMessage());
        response.setData(null);
        response.setErrors(null);

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ResponseStructure<Object>> handleDuplicateEmail(
            DuplicateEmailException ex) {

        ResponseStructure<Object> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.CONFLICT.value());
        response.setMessage(ex.getMessage());
        response.setData(null);
        response.setErrors(null);

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(DuplicateMobileException.class)
    public ResponseEntity<ResponseStructure<Object>> handleDuplicateMobile(
            DuplicateMobileException ex) {

        ResponseStructure<Object> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.CONFLICT.value());
        response.setMessage(ex.getMessage());
        response.setData(null);
        response.setErrors(null);

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ResponseStructure<Object>> handleInvalidCredentials(
            InvalidCredentialsException ex) {

        ResponseStructure<Object> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.UNAUTHORIZED.value());
        response.setMessage(ex.getMessage());
        response.setData(null);
        response.setErrors(null);

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseStructure<Object>> handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        ResponseStructure<Object> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setMessage("Validation Failed");
        response.setData(null);
        response.setErrors(errors);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseStructure<Object>> handleException(
            Exception ex) {

        ResponseStructure<Object> response = new ResponseStructure<>();

        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setMessage(ex.getMessage());
        response.setData(null);
        response.setErrors(null);

        return new ResponseEntity<>(response,
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

}