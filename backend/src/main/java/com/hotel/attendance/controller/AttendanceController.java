package com.hotel.attendance.controller;

import com.hotel.attendance.dto.ApiResponse;
import com.hotel.attendance.dto.AttendanceBulkSaveRequest;
import com.hotel.attendance.dto.AttendanceRecordDto;
import com.hotel.attendance.model.Attendance;
import com.hotel.attendance.service.AttendanceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/daily")
    public ResponseEntity<ApiResponse<List<AttendanceRecordDto>>> getDailyAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        List<AttendanceRecordDto> list = attendanceService.getAttendanceForDate(date);
        return ResponseEntity.ok(ApiResponse.ok("हजेरी यादी (" + date + ")", list));
    }

    @PostMapping("/bulk-save")
    public ResponseEntity<ApiResponse<List<Attendance>>> saveAttendance(
            @RequestBody AttendanceBulkSaveRequest request) {
        if (request.getRecords() == null || request.getRecords().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("हजेरी रेकॉर्ड्स रिकामे आहेत"));
        }

        List<Attendance> saved = attendanceService.saveBulkAttendance(request);
        return ResponseEntity.ok(ApiResponse.ok("हजेरी यशस्वीरित्या सेव्ह झाली!", saved));
    }
}
