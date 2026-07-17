package com.StudentFeeManagement.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.StudentFeeManagement.entity.Fee;
import com.StudentFeeManagement.entity.Student;
import com.StudentFeeManagement.repository.FeeRepository;

@Repository
public class FeeDAO {

    @Autowired
    private FeeRepository feeRepository;

    public Fee saveFee(Fee fee) {
        return feeRepository.save(fee);
    }

    public Optional<Fee> findById(Integer id) {
        return feeRepository.findById(id);
    }

    public List<Fee> findAll() {
        return feeRepository.findAll();
    }

    public List<Fee> findByStudent(Student student) {
        return feeRepository.findByStudent(student);
    }

    public void delete(Fee fee) {
        feeRepository.delete(fee);
    }

}