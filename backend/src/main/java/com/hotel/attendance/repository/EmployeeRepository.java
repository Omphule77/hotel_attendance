package com.hotel.attendance.repository;

import com.hotel.attendance.model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends MongoRepository<Employee, String> {
    List<Employee> findByStatusOrderByNameAsc(String status);
    List<Employee> findAllByOrderByNameAsc();
}
