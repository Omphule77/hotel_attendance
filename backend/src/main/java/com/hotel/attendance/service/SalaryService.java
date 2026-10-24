package com.hotel.attendance.service;

import com.hotel.attendance.dto.MonthlySalarySummaryDto;
import com.hotel.attendance.model.Attendance;
import com.hotel.attendance.model.Employee;
import com.hotel.attendance.model.SalaryAdvance;
import com.hotel.attendance.repository.AttendanceRepository;
import com.hotel.attendance.repository.EmployeeRepository;
import com.hotel.attendance.repository.SalaryAdvanceRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SalaryService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final SalaryAdvanceRepository salaryAdvanceRepository;

    public SalaryService(EmployeeRepository employeeRepository,
                         AttendanceRepository attendanceRepository,
                         SalaryAdvanceRepository salaryAdvanceRepository) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.salaryAdvanceRepository = salaryAdvanceRepository;
    }

    /**
     * दिलेल्या महिना आणि वर्षासाठी सर्व कर्मचाऱ्यांची हजेरी आणि अंतिम पगार काढणे
     */
    public List<MonthlySalarySummaryDto> calculateMonthlySalaries(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        int daysInMonth = yearMonth.lengthOfMonth();

        List<Employee> employees = employeeRepository.findAllByOrderByNameAsc();
        List<Attendance> attendances = attendanceRepository.findByAttendanceDateBetween(startDate, endDate);
        List<SalaryAdvance> advances = salaryAdvanceRepository.findByAdvanceDateBetween(startDate, endDate);

        // कर्मचाऱ्यानुसार हजेरी मॅप करा
        Map<String, List<Attendance>> empAttendanceMap = attendances.stream()
                .filter(a -> a.getEmployeeId() != null)
                .collect(Collectors.groupingBy(Attendance::getEmployeeId));

        // कर्मचाऱ्यानुसार उचल मॅप करा
        Map<String, List<SalaryAdvance>> empAdvanceMap = advances.stream()
                .filter(a -> a.getEmployeeId() != null)
                .collect(Collectors.groupingBy(SalaryAdvance::getEmployeeId));

        List<MonthlySalarySummaryDto> summaryList = new ArrayList<>();

        for (Employee emp : employees) {
            MonthlySalarySummaryDto dto = new MonthlySalarySummaryDto();
            dto.setEmployeeId(emp.getId());
            dto.setEmployeeName(emp.getName());
            dto.setMobile(emp.getMobile());
            dto.setRole(emp.getRole());
            dto.setSalaryType(emp.getSalaryType());
            dto.setBaseSalary(emp.getSalaryAmount());
            dto.setPerHourRate(emp.getPerHourRate());
            dto.setTotalDaysInMonth(daysInMonth);

            List<Attendance> empAttList = empAttendanceMap.getOrDefault(emp.getId(), new ArrayList<>());
            
            double presentCount = 0;
            double halfDayCount = 0;
            double absentCount = 0;
            double totalHours = 0;

            for (Attendance att : empAttList) {
                if ("PRESENT".equalsIgnoreCase(att.getStatus())) {
                    presentCount += 1.0;
                    totalHours += (att.getHoursWorked() != null ? att.getHoursWorked() : 8.0);
                } else if ("HALF_DAY".equalsIgnoreCase(att.getStatus())) {
                    halfDayCount += 1.0;
                    totalHours += (att.getHoursWorked() != null ? att.getHoursWorked() : 4.0);
                } else if ("ABSENT".equalsIgnoreCase(att.getStatus())) {
                    absentCount += 1.0;
                }
            }

            dto.setPresentDays(presentCount);
            dto.setHalfDays(halfDayCount);
            dto.setAbsentDays(absentCount);
            dto.setTotalHoursWorked(totalHours);

            // उचल वजावट काढणे
            List<SalaryAdvance> empAdvList = empAdvanceMap.getOrDefault(emp.getId(), new ArrayList<>());
            BigDecimal totalAdvance = empAdvList.stream()
                    .map(SalaryAdvance::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            dto.setAdvanceDeduction(totalAdvance);

            // पगार गणना (Salary Calculation Formula)
            BigDecimal gross = BigDecimal.ZERO;
            BigDecimal base = emp.getSalaryAmount() != null ? emp.getSalaryAmount() : BigDecimal.ZERO;

            if ("DAILY".equalsIgnoreCase(emp.getSalaryType())) {
                BigDecimal presentPay = base.multiply(BigDecimal.valueOf(presentCount));
                BigDecimal halfDayPay = base.multiply(BigDecimal.valueOf(halfDayCount * 0.5));
                gross = presentPay.add(halfDayPay);
            } else {
                if (daysInMonth > 0) {
                    BigDecimal perDaySalary = base.divide(BigDecimal.valueOf(daysInMonth), 4, RoundingMode.HALF_UP);
                    BigDecimal payableDays = BigDecimal.valueOf(presentCount + (halfDayCount * 0.5));
                    gross = perDaySalary.multiply(payableDays).setScale(2, RoundingMode.HALF_UP);
                }
            }

            dto.setGrossSalary(gross.setScale(2, RoundingMode.HALF_UP));

            // अंतिम पगार = एकूण पगार - उचल
            BigDecimal net = gross.subtract(totalAdvance);
            if (net.compareTo(BigDecimal.ZERO) < 0) {
                net = BigDecimal.ZERO;
            }
            dto.setFinalSalary(net.setScale(2, RoundingMode.HALF_UP));

            summaryList.add(dto);
        }

        return summaryList;
    }

    /**
     * कर्मचाऱ्यासाठी उचल (Advance) जोडणे
     */
    public SalaryAdvance addAdvance(String empId, LocalDate date, BigDecimal amount, String reason) {
        if (!employeeRepository.existsById(empId)) {
            throw new RuntimeException("कर्मचारी सापडला नाही");
        }
        SalaryAdvance advance = new SalaryAdvance(empId, date != null ? date : LocalDate.now(), amount, reason);
        return salaryAdvanceRepository.save(advance);
    }
}
