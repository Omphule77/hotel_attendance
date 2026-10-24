package com.hotel.attendance.dto;

import java.math.BigDecimal;

public class AttendanceRecordDto {
    private String employeeId;
    private String employeeName;
    private String mobile;
    private String role;
    private String salaryType;
    private BigDecimal salaryAmount;
    private BigDecimal perHourRate;
    private String status; // 'PRESENT', 'ABSENT', 'HALF_DAY'
    private Double hoursWorked;
    private String notes;

    public AttendanceRecordDto() {}

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getSalaryType() { return salaryType; }
    public void setSalaryType(String salaryType) { this.salaryType = salaryType; }

    public BigDecimal getSalaryAmount() { return salaryAmount; }
    public void setSalaryAmount(BigDecimal salaryAmount) { this.salaryAmount = salaryAmount; }

    public BigDecimal getPerHourRate() { return perHourRate; }
    public void setPerHourRate(BigDecimal perHourRate) { this.perHourRate = perHourRate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getHoursWorked() { return hoursWorked; }
    public void setHoursWorked(Double hoursWorked) { this.hoursWorked = hoursWorked; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
