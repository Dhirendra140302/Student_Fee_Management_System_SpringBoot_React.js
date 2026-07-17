package com.StudentFeeManagement.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class FeeDTO {

    @NotNull(message = "Student ID is required")
    private Integer studentId;

    @PositiveOrZero(message = "Paid amount cannot be negative")
    private Double paidAmount;

    @NotBlank(message = "Payment mode is required")
    private String paymentMode;

    @NotBlank(message = "Status is required")
    private String status;

    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;
}