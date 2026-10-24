package com.hotel.attendance.dto;

import java.math.BigDecimal;

public class MonthlySalarySummaryDto {
    private String employeeId;
    private String employeeName;
    private String mobile;
    private String role;
    private String salaryType; // 'DAILY' / 'MONTHLY'
    private BigDecimal baseSalary; // मूळ पगार
    private BigDecimal perHourRate;
    
    private int totalDaysInMonth; // महिना एकूण दिवस (उदा. ३० किंवा ३१)
    private double presentDays; // हजर दिवस
    private double halfDays; // अर्धा दिवस
    private double absentDays; // गैरहजर दिवस
    private double totalHoursWorked; // एकूण तास
    
    private BigDecimal grossSalary; // हजेरीनुसार एकूण झालेला पगार
    private BigDecimal advanceDeduction; // उचल/अ‍ॅडव्हान्स वजावट
    private BigDecimal finalSalary; // अंतिम हातात मिळणारा पगार (Net Salary)
    
    public MonthlySalarySummaryDto() {}

    // Getters and Setters
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

    public BigDecimal getBaseSalary() { return baseSalary; }
    public void setBaseSalary(BigDecimal baseSalary) { this.baseSalary = baseSalary; }

    public BigDecimal getPerHourRate() { return perHourRate; }
    public void setPerHourRate(BigDecimal perHourRate) { this.perHourRate = perHourRate; }

    public int getTotalDaysInMonth() { return totalDaysInMonth; }
    public void setTotalDaysInMonth(int totalDaysInMonth) { this.totalDaysInMonth = totalDaysInMonth; }

    public double getPresentDays() { return presentDays; }
    public void setPresentDays(double presentDays) { this.presentDays = presentDays; }

    public double getHalfDays() { return halfDays; }
    public void setHalfDays(double halfDays) { this.halfDays = halfDays; }

    public double getAbsentDays() { return absentDays; }
    public void setAbsentDays(double absentDays) { this.absentDays = absentDays; }

    public double getTotalHoursWorked() { return totalHoursWorked; }
    public void setTotalHoursWorked(double totalHoursWorked) { this.totalHoursWorked = totalHoursWorked; }

    public BigDecimal getGrossSalary() { return grossSalary; }
    public void setGrossSalary(BigDecimal grossSalary) { this.grossSalary = grossSalary; }

    public BigDecimal getAdvanceDeduction() { return advanceDeduction; }
    public void setAdvanceDeduction(BigDecimal advanceDeduction) { this.advanceDeduction = advanceDeduction; }

    public BigDecimal getFinalSalary() { return finalSalary; }
    public void setFinalSalary(BigDecimal finalSalary) { this.finalSalary = finalSalary; }
}
