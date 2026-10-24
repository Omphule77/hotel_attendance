package com.hotel.attendance.repository;

import com.hotel.attendance.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    
    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);
    
    Optional<Attendance> findByEmployeeIdAndAttendanceDate(String employeeId, LocalDate attendanceDate);
    
    List<Attendance> findByAttendanceDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Attendance> findByEmployeeIdAndAttendanceDateBetween(String employeeId, LocalDate startDate, LocalDate endDate);
}
