package com.StudentFeeManagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CourseDTO {

    @NotBlank(message = "Course name is required")
    private String courseName;

    @NotBlank(message = "Duration is required")
    private String duration;

    @Positive(message = "Fee should be greater than zero")
    private Double fees;

    private String description;
}