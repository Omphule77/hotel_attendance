package com.hotel.attendance.dto;

import java.time.LocalDate;
import java.util.List;

public class AttendanceBulkSaveRequest {
    private LocalDate attendanceDate;
    private List<AttendanceRecordDto> records;

    public AttendanceBulkSaveRequest() {}

    public AttendanceBulkSaveRequest(LocalDate attendanceDate, List<AttendanceRecordDto> records) {
        this.attendanceDate = attendanceDate;
        this.records = records;
    }

    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }

    public List<AttendanceRecordDto> getRecords() { return records; }
    public void setRecords(List<AttendanceRecordDto> records) { this.records = records; }
}
