package com.hotel.attendance.repository;

import com.hotel.attendance.model.SalaryAdvance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalaryAdvanceRepository extends MongoRepository<SalaryAdvance, String> {
    List<SalaryAdvance> findByEmployeeIdAndAdvanceDateBetween(String employeeId, LocalDate start, LocalDate end);
    List<SalaryAdvance> findByAdvanceDateBetween(LocalDate start, LocalDate end);
}
