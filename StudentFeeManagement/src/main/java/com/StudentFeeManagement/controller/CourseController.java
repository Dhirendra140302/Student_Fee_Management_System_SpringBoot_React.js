package com.StudentFeeManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.StudentFeeManagement.dto.CourseDTO;
import com.StudentFeeManagement.entity.Course;
import com.StudentFeeManagement.service.CourseService;
import com.StudentFeeManagement.util.ApiResponse;
import com.StudentFeeManagement.util.ResponseStructure;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

	@Autowired
	private CourseService courseService;

	@PostMapping
	public ResponseEntity<ResponseStructure<Course>> saveCourse(@Valid @RequestBody CourseDTO dto) {

		Course saved = courseService.saveCourse(dto);

		ResponseStructure<Course> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.CREATED.value());
		response.setMessage(ApiResponse.COURSE_SAVED);
		response.setData(saved);
		response.setErrors(null);

		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ResponseStructure<Course>> getCourseById(@PathVariable Integer id) {

		Course course = courseService.getCourseById(id);

		ResponseStructure<Course> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage(ApiResponse.COURSE_FETCHED);
		response.setData(course);
		response.setErrors(null);

		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<ResponseStructure<List<Course>>> getAllCourses() {

		List<Course> courses = courseService.getAllCourses();

		ResponseStructure<List<Course>> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage(ApiResponse.COURSES_FETCHED);
		response.setData(courses);
		response.setErrors(null);

		return ResponseEntity.ok(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ResponseStructure<Course>> updateCourse(@PathVariable Integer id,
			@Valid @RequestBody CourseDTO dto) {

		Course updated = courseService.updateCourse(id, dto);

		ResponseStructure<Course> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage(ApiResponse.COURSE_UPDATED);
		response.setData(updated);
		response.setErrors(null);

		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ResponseStructure<String>> deleteCourse(@PathVariable Integer id) {

		courseService.deleteCourse(id);

		ResponseStructure<String> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage(ApiResponse.COURSE_DELETED);
		response.setData("Course with id " + id + " deleted.");
		response.setErrors(null);

		return ResponseEntity.ok(response);
	}
}
