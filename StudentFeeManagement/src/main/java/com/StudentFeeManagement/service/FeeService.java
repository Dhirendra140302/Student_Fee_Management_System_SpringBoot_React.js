package com.StudentFeeManagement.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.StudentFeeManagement.dao.FeeDAO;
import com.StudentFeeManagement.dao.StudentDAO;
import com.StudentFeeManagement.dto.FeeDTO;
import com.StudentFeeManagement.entity.Fee;
import com.StudentFeeManagement.entity.Student;
import com.StudentFeeManagement.exception.FeeNotFoundException;
import com.StudentFeeManagement.exception.StudentNotFoundException;

@Service
public class FeeService {

	@Autowired
	private FeeDAO feeDAO;

	@Autowired
	private StudentDAO studentDAO;

	// Record a new fee payment
	public Fee saveFee(FeeDTO dto) {
		Student student = studentDAO.findById(dto.getStudentId())
				.orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + dto.getStudentId()));

		double totalFees = student.getCourse().getFees();
		double paidAmount = dto.getPaidAmount();
		double remainingAmount = totalFees - paidAmount;
		if (remainingAmount < 0)
			remainingAmount = 0;

		String status = remainingAmount == 0 ? "Paid" : "Pending";

		Fee fee = new Fee();
		fee.setStudent(student);
		fee.setTotalFees(totalFees);
		fee.setPaidAmount(paidAmount);
		fee.setRemainingAmount(remainingAmount);
		fee.setPaymentDate(LocalDate.now());
		fee.setPaymentMode(dto.getPaymentMode());
		fee.setStatus(status);

		return feeDAO.saveFee(fee);
	}

	// Get fee by ID
	public Fee getFeeById(Integer id) {
		return feeDAO.findById(id).orElseThrow(() -> new FeeNotFoundException("Fee record not found with id: " + id));
	}

	// Get all fee records
	public List<Fee> getAllFees() {
		return feeDAO.findAll();
	}

	// Get all fee records for a specific student
	public List<Fee> getFeesByStudent(Integer studentId) {
		Student student = studentDAO.findById(studentId)
				.orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + studentId));
		return feeDAO.findByStudent(student);
	}

	// Update a fee record
	public Fee updateFee(Integer id, FeeDTO dto) {
		Fee existing = feeDAO.findById(id)
				.orElseThrow(() -> new FeeNotFoundException("Fee record not found with id: " + id));

		Student student = studentDAO.findById(dto.getStudentId())
				.orElseThrow(() -> new StudentNotFoundException("Student not found with id: " + dto.getStudentId()));

		double totalFees = student.getCourse().getFees();
		double paidAmount = dto.getPaidAmount();
		double remainingAmount = totalFees - paidAmount;
		if (remainingAmount < 0)
			remainingAmount = 0;

		String status = remainingAmount == 0 ? "Paid" : "Pending";

		existing.setStudent(student);
		existing.setTotalFees(totalFees);
		existing.setPaidAmount(paidAmount);
		existing.setRemainingAmount(remainingAmount);
		existing.setPaymentDate(LocalDate.now());
		existing.setPaymentMode(dto.getPaymentMode());
		existing.setStatus(status);

		return feeDAO.saveFee(existing);
	}

	// Delete a fee record
	public void deleteFee(Integer id) {
		Fee fee = feeDAO.findById(id)
				.orElseThrow(() -> new FeeNotFoundException("Fee record not found with id: " + id));
		feeDAO.delete(fee);
	}
}
