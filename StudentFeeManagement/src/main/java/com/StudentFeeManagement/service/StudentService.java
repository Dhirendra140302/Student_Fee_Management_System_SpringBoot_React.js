package com.StudentFeeManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.StudentFeeManagement.dao.CourseDAO;
import com.StudentFeeManagement.dao.StudentDAO;
import com.StudentFeeManagement.dto.StudentDTO;
import com.StudentFeeManagement.entity.Course;
import com.StudentFeeManagement.entity.Student;
import com.StudentFeeManagement.exception.CourseNotFoundException;
import com.StudentFeeManagement.exception.DuplicateEmailException;
import com.StudentFeeManagement.exception.DuplicateMobileException;
import com.StudentFeeManagement.exception.StudentNotFoundException;

@Service
public class StudentService {

	@Autowired
	private StudentDAO studentDAO;

	@Autowired
	private CourseDAO courseDAO;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	// Save a new student
	public Student saveStudent(StudentDTO dto) {
		if (studentDAO.existsByEmail(dto.getEmail())) {
			throw new DuplicateEmailException("Email already registered: " + dto.getEmail());
		}
		if (studentDAO.existsByMobile(dto.getMobile())) {
			throw new DuplicateMobileException("Mobile number already registered: " + dto.getMobile());
		}

		Course course = courseDAO.findById(dto.getCourseId())
				.orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + dto.getCourseId()));

		Student student = new Student();
		student.setName(dto.getName());
		student.setEmail(dto.getEmail());
		student.setPassword(passwordEncoder.encode(dto.getPassword()));
		student.setMobile(dto.getMobile());
		student.setAddress(dto.getAddress());
		student.setDob(dto.getDob());
		student.setGender(dto.getGender());
		student.setCourse(course);

		return studentDAO.saveStudent(student);
	}

	// Get student by ID
	public Student getStudentById(Integer id) {
		return studentDAO.findById(id)
				.orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
	}

	// Get all students
	public List<Student> getAllStudents() {
		return studentDAO.findAll();
	}

	// Update student
	public Student updateStudent(Integer id, StudentDTO dto) {
		Student existing = studentDAO.findById(id)
				.orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));

		// Check email conflict only if it changed
		if (!existing.getEmail().equals(dto.getEmail()) && studentDAO.existsByEmail(dto.getEmail())) {
			throw new DuplicateEmailException("Email already in use: " + dto.getEmail());
		}
		// Check mobile conflict only if it changed
		if (!existing.getMobile().equals(dto.getMobile()) && studentDAO.existsByMobile(dto.getMobile())) {
			throw new DuplicateMobileException("Mobile number already in use: " + dto.getMobile());
		}

		Course course = courseDAO.findById(dto.getCourseId())
				.orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + dto.getCourseId()));

		existing.setName(dto.getName());
		existing.setEmail(dto.getEmail());
		// Only re-hash if a new password is provided
		if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
			existing.setPassword(passwordEncoder.encode(dto.getPassword()));
		}
		existing.setMobile(dto.getMobile());
		existing.setAddress(dto.getAddress());
		existing.setDob(dto.getDob());
		existing.setGender(dto.getGender());
		existing.setCourse(course);

		return studentDAO.saveStudent(existing);
	}

	// Delete student
	public void deleteStudent(Integer id) {
		Student student = studentDAO.findById(id)
				.orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + id));
		studentDAO.delete(student);
	}
}
