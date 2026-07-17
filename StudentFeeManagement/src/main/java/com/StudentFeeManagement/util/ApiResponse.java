package com.StudentFeeManagement.util;

/**
 * Application Response Messages
 */
public class ApiResponse {

    private ApiResponse() {
    }

    // Admin
    public static final String ADMIN_REGISTERED = "Admin Registered Successfully";
    public static final String ADMIN_UPDATED = "Admin Updated Successfully";
    public static final String ADMIN_DELETED = "Admin Deleted Successfully";

    // Login
    public static final String LOGIN_SUCCESS = "Login Successful";
    public static final String LOGOUT_SUCCESS = "Logout Successful";

    // Student
    public static final String STUDENT_SAVED = "Student Saved Successfully";
    public static final String STUDENT_UPDATED = "Student Updated Successfully";
    public static final String STUDENT_DELETED = "Student Deleted Successfully";
    public static final String STUDENT_FETCHED = "Student Found Successfully";
    public static final String STUDENTS_FETCHED = "Students Retrieved Successfully";

    // Course
    public static final String COURSE_SAVED = "Course Saved Successfully";
    public static final String COURSE_UPDATED = "Course Updated Successfully";
    public static final String COURSE_DELETED = "Course Deleted Successfully";
    public static final String COURSE_FETCHED = "Course Found Successfully";
    public static final String COURSES_FETCHED = "Courses Retrieved Successfully";

    // Fee
    public static final String FEE_SAVED = "Fee Record Saved Successfully";
    public static final String FEE_UPDATED = "Fee Updated Successfully";
    public static final String FEE_DELETED = "Fee Deleted Successfully";
    public static final String FEE_FETCHED = "Fee Retrieved Successfully";
    public static final String FEES_FETCHED = "Fees Retrieved Successfully";

}