package com.hotel.attendance.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "attendance")
@CompoundIndex(name = "emp_date_idx", def = "{'employeeId': 1, 'attendanceDate': 1}", unique = true)
public class Attendance {

    @Id
    private String id;

    @Indexed
    private String employeeId;

    @Indexed
    private LocalDate attendanceDate;

    // 'PRESENT' (हजर), 'ABSENT' (गैरहजर), 'HALF_DAY' (अर्धा दिवस)
    private String status = "PRESENT";

    // कामाचे एकूण तास (उदा. ८.०, ४.०, किंवा १०.० तास)
    private Double hoursWorked = 8.0;

    private String notes; // शेरा किंवा टिप

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Attendance() {}

    public Attendance(String employeeId, LocalDate attendanceDate, String status, Double hoursWorked, String notes) {
        this.employeeId = employeeId;
        this.attendanceDate = attendanceDate;
        this.status = status != null ? status : "PRESENT";
        this.hoursWorked = hoursWorked != null ? hoursWorked : (status.equals("HALF_DAY") ? 4.0 : (status.equals("ABSENT") ? 0.0 : 8.0));
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getHoursWorked() { return hoursWorked; }
    public void setHoursWorked(Double hoursWorked) { this.hoursWorked = hoursWorked; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
