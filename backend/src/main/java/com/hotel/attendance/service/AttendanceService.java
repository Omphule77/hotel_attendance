package com.hotel.attendance.service;

import com.hotel.attendance.dto.AttendanceBulkSaveRequest;
import com.hotel.attendance.dto.AttendanceRecordDto;
import com.hotel.attendance.model.Attendance;
import com.hotel.attendance.model.Employee;
import com.hotel.attendance.repository.AttendanceRepository;
import com.hotel.attendance.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, EmployeeRepository employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    /**
     * दिलेल्या तारखेसाठी सर्व कर्मचाऱ्यांचे हजेरी रेकॉर्ड्स मिळवा
     */
    public List<AttendanceRecordDto> getAttendanceForDate(LocalDate date) {
        List<Employee> activeEmployees = employeeRepository.findByStatusOrderByNameAsc("ACTIVE");
        List<Attendance> existingAttendance = attendanceRepository.findByAttendanceDate(date);

        Map<String, Attendance> attendanceMap = existingAttendance.stream()
                .filter(a -> a.getEmployeeId() != null)
                .collect(Collectors.toMap(Attendance::getEmployeeId, a -> a, (k1, k2) -> k1));

        List<AttendanceRecordDto> result = new ArrayList<>();
        for (Employee emp : activeEmployees) {
            AttendanceRecordDto dto = new AttendanceRecordDto();
            dto.setEmployeeId(emp.getId());
            dto.setEmployeeName(emp.getName());
            dto.setMobile(emp.getMobile());
            dto.setRole(emp.getRole());
            dto.setSalaryType(emp.getSalaryType());
            dto.setSalaryAmount(emp.getSalaryAmount());
            dto.setPerHourRate(emp.getPerHourRate());

            Attendance att = attendanceMap.get(emp.getId());
            if (att != null) {
                dto.setStatus(att.getStatus());
                dto.setHoursWorked(att.getHoursWorked());
                dto.setNotes(att.getNotes());
            } else {
                dto.setStatus("PRESENT");
                dto.setHoursWorked(8.0);
                dto.setNotes("");
            }
            result.add(dto);
        }

        return result;
    }

    /**
     * कर्मचाऱ्यांची हजेरी एकत्रित सेव्ह किंवा अपडेट करा
     */
    public List<Attendance> saveBulkAttendance(AttendanceBulkSaveRequest request) {
        LocalDate date = request.getAttendanceDate() != null ? request.getAttendanceDate() : LocalDate.now();
        List<Attendance> savedList = new ArrayList<>();

        for (AttendanceRecordDto recordDto : request.getRecords()) {
            if (recordDto.getEmployeeId() == null || recordDto.getEmployeeId().trim().isEmpty()) continue;

            String empId = recordDto.getEmployeeId().trim();
            Employee employee = employeeRepository.findById(empId).orElse(null);
            if (employee == null) continue;

            Attendance attendance = attendanceRepository
                    .findByEmployeeIdAndAttendanceDate(empId, date)
                    .orElse(new Attendance());

            attendance.setEmployeeId(empId);
            attendance.setAttendanceDate(date);
            attendance.setStatus(recordDto.getStatus() != null ? recordDto.getStatus() : "PRESENT");
            
            Double hours = recordDto.getHoursWorked();
            if (hours == null) {
                if ("PRESENT".equalsIgnoreCase(attendance.getStatus())) hours = 8.0;
                else if ("HALF_DAY".equalsIgnoreCase(attendance.getStatus())) hours = 4.0;
                else hours = 0.0;
            }
            attendance.setHoursWorked(hours);
            attendance.setNotes(recordDto.getNotes());
            attendance.setUpdatedAt(LocalDateTime.now());
            if (attendance.getCreatedAt() == null) {
                attendance.setCreatedAt(LocalDateTime.now());
            }

            savedList.add(attendanceRepository.save(attendance));
        }

        return savedList;
    }
}
