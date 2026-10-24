package com.hotel.attendance.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "salary_advances")
public class SalaryAdvance {

    @Id
    private String id;

    @Indexed
    private String employeeId;

    private LocalDate advanceDate;

    private BigDecimal amount; // घेतलेली उचल रक्कम (₹)

    private String reason = "मासिक उचल"; // उचल कारण

    private LocalDateTime createdAt = LocalDateTime.now();

    public SalaryAdvance() {}

    public SalaryAdvance(String employeeId, LocalDate advanceDate, BigDecimal amount, String reason) {
        this.employeeId = employeeId;
        this.advanceDate = advanceDate;
        this.amount = amount;
        this.reason = reason;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public LocalDate getAdvanceDate() { return advanceDate; }
    public void setAdvanceDate(LocalDate advanceDate) { this.advanceDate = advanceDate; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
