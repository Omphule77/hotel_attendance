package com.hotel.attendance.controller;

import com.hotel.attendance.dto.ApiResponse;
import com.hotel.attendance.dto.MonthlySalarySummaryDto;
import com.hotel.attendance.model.SalaryAdvance;
import com.hotel.attendance.service.SalaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/salary")
@CrossOrigin(origins = "*")
public class SalaryController {

    private final SalaryService salaryService;

    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<List<MonthlySalarySummaryDto>>> getMonthlySalary(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        LocalDate now = LocalDate.now();
        int targetYear = (year != null) ? year : now.getYear();
        int targetMonth = (month != null) ? month : now.getMonthValue();

        List<MonthlySalarySummaryDto> summaries = salaryService.calculateMonthlySalaries(targetYear, targetMonth);
        return ResponseEntity.ok(ApiResponse.ok("मासिक हजेरी व पगार अहवाल (" + targetMonth + "/" + targetYear + ")", summaries));
    }

    @PostMapping("/advance")
    public ResponseEntity<ApiResponse<SalaryAdvance>> addSalaryAdvance(@RequestBody Map<String, Object> payload) {
        try {
            String empId = payload.get("employeeId").toString();
            BigDecimal amount = new BigDecimal(payload.get("amount").toString());
            String reason = payload.getOrDefault("reason", "उचल").toString();
            
            LocalDate date = LocalDate.now();
            if (payload.containsKey("advanceDate") && payload.get("advanceDate") != null) {
                date = LocalDate.parse(payload.get("advanceDate").toString());
            }

            SalaryAdvance advance = salaryService.addAdvance(empId, date, amount, reason);
            return ResponseEntity.ok(ApiResponse.ok("उचल यशस्वीरित्या नोंदवली गेली!", advance));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("उचल नोंदवताना त्रुटी: " + e.getMessage()));
        }
    }
}
