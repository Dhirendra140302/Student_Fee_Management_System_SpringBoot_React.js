package com.StudentFeeManagement.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.StudentFeeManagement.entity.Admin;
import com.StudentFeeManagement.repository.AdminRepository;

@Repository
public class AdminDAO {

    @Autowired
    private AdminRepository adminRepository;

    public Admin saveAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Optional<Admin> findById(Integer id) {
        return adminRepository.findById(id);
    }

    public Optional<Admin> findByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    public boolean existsByEmail(String email) {
        return adminRepository.existsByEmail(email);
    }

    public boolean existsByMobile(String mobile) {
        return adminRepository.existsByMobile(mobile);
    }

    public void delete(Admin admin) {
        adminRepository.delete(admin);
    }

}