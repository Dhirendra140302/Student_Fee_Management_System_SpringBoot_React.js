package com.StudentFeeManagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.StudentFeeManagement.dao.AdminDAO;
import com.StudentFeeManagement.dto.AdminDTO;
import com.StudentFeeManagement.entity.Admin;
import com.StudentFeeManagement.exception.AdminNotFoundException;
import com.StudentFeeManagement.exception.DuplicateEmailException;
import com.StudentFeeManagement.exception.DuplicateMobileException;

@Service
public class AdminService {

	@Autowired
	private AdminDAO adminDAO;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	// Register a new admin
	public Admin registerAdmin(AdminDTO dto) {
		if (adminDAO.existsByEmail(dto.getEmail())) {
			throw new DuplicateEmailException("Email already registered: " + dto.getEmail());
		}
		if (adminDAO.existsByMobile(dto.getMobile())) {
			throw new DuplicateMobileException("Mobile number already registered: " + dto.getMobile());
		}

		Admin admin = new Admin();
		admin.setName(dto.getName());
		admin.setEmail(dto.getEmail());
		admin.setPassword(passwordEncoder.encode(dto.getPassword()));
		admin.setMobile(dto.getMobile());

		return adminDAO.saveAdmin(admin);
	}

	// Get admin by ID
	public Admin getAdminById(Integer id) {
		return adminDAO.findById(id).orElseThrow(() -> new AdminNotFoundException("Admin not found with id: " + id));
	}

	// Get all admins
	public List<Admin> getAllAdmins() {
		return adminDAO.findAll();
	}

	// Update admin
	public Admin updateAdmin(Integer id, AdminDTO dto) {
		Admin existing = adminDAO.findById(id)
				.orElseThrow(() -> new AdminNotFoundException("Admin not found with id: " + id));

		// Check email conflict only if it changed
		if (!existing.getEmail().equals(dto.getEmail()) && adminDAO.existsByEmail(dto.getEmail())) {
			throw new DuplicateEmailException("Email already in use: " + dto.getEmail());
		}
		// Check mobile conflict only if it changed
		if (!existing.getMobile().equals(dto.getMobile()) && adminDAO.existsByMobile(dto.getMobile())) {
			throw new DuplicateMobileException("Mobile number already in use: " + dto.getMobile());
		}

		existing.setName(dto.getName());
		existing.setEmail(dto.getEmail());
		existing.setPassword(passwordEncoder.encode(dto.getPassword()));
		existing.setMobile(dto.getMobile());

		return adminDAO.saveAdmin(existing);
	}

	// Delete admin
	public void deleteAdmin(Integer id) {
		Admin admin = adminDAO.findById(id)
				.orElseThrow(() -> new AdminNotFoundException("Admin not found with id: " + id));
		adminDAO.delete(admin);
	}
}
