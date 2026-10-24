package com.hotel.attendance.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "employees")
public class Employee {

    @Id
    private String id;

    private String name; // कर्मचाऱ्याचे नाव

    private String mobile; // मोबाईल नंबर

    private String role = "वेटर"; // पद (उदा. वेटर, मुख्य आचारी, हेल्पर, इ.)

    private String salaryType = "DAILY"; // 'DAILY' (दररोजचा) किंवा 'MONTHLY' (मासिक)

    private BigDecimal salaryAmount; // पगार रक्कम (₹)

    private BigDecimal perHourRate = BigDecimal.ZERO; // तासानुसार कामासाठी दर (₹)

    private LocalDate joiningDate; // रुजू झाल्याची तारीख

    private String status = "ACTIVE"; // 'ACTIVE' / 'INACTIVE'

    private String address; // पत्ता (ऐच्छिक)

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Employee() {}

    public Employee(String name, String mobile, String role, String salaryType, 
                    BigDecimal salaryAmount, BigDecimal perHourRate, LocalDate joiningDate, String address) {
        this.name = name;
        this.mobile = mobile;
        this.role = role != null ? role : "वेटर";
        this.salaryType = salaryType != null ? salaryType : "DAILY";
        this.salaryAmount = salaryAmount;
        this.perHourRate = perHourRate != null ? perHourRate : BigDecimal.ZERO;
        this.joiningDate = joiningDate != null ? joiningDate : LocalDate.now();
        this.address = address;
        this.status = "ACTIVE";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

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

    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
