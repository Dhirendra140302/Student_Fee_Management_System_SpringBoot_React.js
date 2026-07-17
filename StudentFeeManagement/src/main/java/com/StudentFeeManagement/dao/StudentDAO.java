package com.StudentFeeManagement.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.StudentFeeManagement.entity.Student;
import com.StudentFeeManagement.repository.StudentRepository;

@Repository
public class StudentDAO {

    @Autowired
    private StudentRepository studentRepository;

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    public Optional<Student> findById(Integer id) {
        return studentRepository.findById(id);
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public Optional<Student> findByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return studentRepository.existsByEmail(email);
    }

    public boolean existsByMobile(String mobile) {
        return studentRepository.existsByMobile(mobile);
    }

    public void delete(Student student) {
        studentRepository.delete(student);
    }

}