package com.StudentFeeManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.StudentFeeManagement.dao.CourseDAO;
import com.StudentFeeManagement.dto.CourseDTO;
import com.StudentFeeManagement.entity.Course;
import com.StudentFeeManagement.exception.CourseNotFoundException;

@Service
public class CourseService {

	@Autowired
	private CourseDAO courseDAO;

	// Save a new course
	public Course saveCourse(CourseDTO dto) {
		Course course = new Course();
		course.setCourseName(dto.getCourseName());
		course.setDuration(dto.getDuration());
		course.setFees(dto.getFees());
		course.setDescription(dto.getDescription());

		return courseDAO.saveCourse(course);
	}

	// Get course by ID
	public Course getCourseById(Integer id) {
		return courseDAO.findById(id).orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));
	}

	// Get all courses
	public List<Course> getAllCourses() {
		return courseDAO.findAll();
	}

	// Update course
	public Course updateCourse(Integer id, CourseDTO dto) {
		Course existing = courseDAO.findById(id)
				.orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));

		existing.setCourseName(dto.getCourseName());
		existing.setDuration(dto.getDuration());
		existing.setFees(dto.getFees());
		existing.setDescription(dto.getDescription());

		return courseDAO.saveCourse(existing);
	}

	// Delete course
	public void deleteCourse(Integer id) {
		Course course = courseDAO.findById(id)
				.orElseThrow(() -> new CourseNotFoundException("Course not found with id: " + id));
		courseDAO.delete(course);
	}
}
