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

import com.StudentFeeManagement.dto.StudentDTO;
import com.StudentFeeManagement.entity.Student;
import com.StudentFeeManagement.service.StudentService;
import com.StudentFeeManagement.util.ApiResponse;
import com.StudentFeeManagement.util.ResponseStructure;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/students")
public class StudentController {

	@Autowired
	private StudentService studentService;

	@PostMapping
	public ResponseEntity<ResponseStructure<Student>> saveStudent(@Valid @RequestBody StudentDTO dto) {

		Student saved = studentService.saveStudent(dto);

		ResponseStructure<Student> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.CREATED.value());
		response.setMessage(ApiResponse.STUDENT_SAVED);
		response.setData(saved);
		response.setErrors(null);

		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ResponseStructure<Student>> getStudentById(@PathVariable Integer id) {

		Student student = studentService.getStudentById(id);

		ResponseStructure<Student> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage(ApiResponse.STUDENT_FETCHED);
		response.setData(student);
		response.setErrors(null);

		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<ResponseStructure<List<Student>>> getAllStudents() {

		List<Student> students = studentService.getAllStudents();

		ResponseStructure<List<Student>> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage(ApiResponse.STUDENTS_FETCHED);
		response.setData(students);
		response.setErrors(null);

		return ResponseEntity.ok(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ResponseStructure<Student>> updateStudent(@PathVariable Integer id,
			@Valid @RequestBody StudentDTO dto) {

		Student updated = studentService.updateStudent(id, dto);

		ResponseStructure<Student> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage(ApiResponse.STUDENT_UPDATED);
		response.setData(updated);
		response.setErrors(null);

		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ResponseStructure<String>> deleteStudent(@PathVariable Integer id) {

		studentService.deleteStudent(id);

		ResponseStructure<String> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage(ApiResponse.STUDENT_DELETED);
		response.setData("Student with id " + id + " deleted.");
		response.setErrors(null);

		return ResponseEntity.ok(response);
	}
}
