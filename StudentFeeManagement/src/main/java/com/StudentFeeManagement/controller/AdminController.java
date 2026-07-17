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

import com.StudentFeeManagement.dto.AdminDTO;
import com.StudentFeeManagement.entity.Admin;
import com.StudentFeeManagement.service.AdminService;
import com.StudentFeeManagement.util.ApiResponse;
import com.StudentFeeManagement.util.ResponseStructure;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

	@Autowired
	private AdminService adminService;

	@PostMapping("/register")
	public ResponseEntity<ResponseStructure<Admin>> registerAdmin(@Valid @RequestBody AdminDTO dto) {

		Admin saved = adminService.registerAdmin(dto);

		ResponseStructure<Admin> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.CREATED.value());
		response.setMessage(ApiResponse.ADMIN_REGISTERED);
		response.setData(saved);
		response.setErrors(null);

		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ResponseStructure<Admin>> getAdminById(@PathVariable Integer id) {

		Admin admin = adminService.getAdminById(id);

		ResponseStructure<Admin> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Admin fetched successfully");
		response.setData(admin);
		response.setErrors(null);

		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<ResponseStructure<List<Admin>>> getAllAdmins() {

		List<Admin> admins = adminService.getAllAdmins();

		ResponseStructure<List<Admin>> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Admins fetched successfully");
		response.setData(admins);
		response.setErrors(null);

		return ResponseEntity.ok(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ResponseStructure<Admin>> updateAdmin(@PathVariable Integer id,
			@Valid @RequestBody AdminDTO dto) {

		Admin updated = adminService.updateAdmin(id, dto);

		ResponseStructure<Admin> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage(ApiResponse.ADMIN_UPDATED);
		response.setData(updated);
		response.setErrors(null);

		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ResponseStructure<String>> deleteAdmin(@PathVariable Integer id) {

		adminService.deleteAdmin(id);

		ResponseStructure<String> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage(ApiResponse.ADMIN_DELETED);
		response.setData("Admin with id " + id + " deleted.");
		response.setErrors(null);

		return ResponseEntity.ok(response);
	}
}
