package com.StudentFeeManagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.StudentFeeManagement.entity.Fee;
import com.StudentFeeManagement.entity.Student;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Integer> {

    List<Fee> findByStudent(Student student);

}