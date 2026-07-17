package com.StudentFeeManagement.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.StudentFeeManagement.entity.Admin;
import com.StudentFeeManagement.repository.AdminRepository;

@Component
public class DataInitializer implements CommandLineRunner {

	private final AdminRepository adminRepository;
	private final BCryptPasswordEncoder passwordEncoder;

	public DataInitializer(AdminRepository adminRepository, BCryptPasswordEncoder passwordEncoder) {
		this.adminRepository = adminRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void run(String... args) {
		final String defaultEmail = "admin@gmail.com";
		final String defaultPassword = "admin123";
		final String defaultName = "Admin";
		final String defaultMobile = "9000000000";

		if (adminRepository.existsByEmail(defaultEmail)) {
			System.out.println("[DataInitializer] Default admin already exists — skipping seed.");
			return;
		}

		Admin admin = new Admin();
		admin.setName(defaultName);
		admin.setEmail(defaultEmail);
		admin.setPassword(passwordEncoder.encode(defaultPassword));
		admin.setMobile(defaultMobile);

		adminRepository.save(admin);
		System.out.println("[DataInitializer] Default admin created: " + defaultEmail);
	}
}
