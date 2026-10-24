package com.hotel.attendance.service;

import com.hotel.attendance.model.Employee;
import com.hotel.attendance.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAllByOrderByNameAsc();
    }

    public List<Employee> getActiveEmployees() {
        return employeeRepository.findByStatusOrderByNameAsc("ACTIVE");
    }

    public Optional<Employee> getEmployeeById(String id) {
        return employeeRepository.findById(id);
    }

    public Employee saveEmployee(Employee employee) {
        if (employee.getRole() == null || employee.getRole().trim().isEmpty()) {
            employee.setRole("वेटर");
        }
        if (employee.getStatus() == null) {
            employee.setStatus("ACTIVE");
        }
        if (employee.getCreatedAt() == null) {
            employee.setCreatedAt(LocalDateTime.now());
        }
        employee.setUpdatedAt(LocalDateTime.now());
        return employeeRepository.save(employee);
    }

    public Optional<Employee> updateEmployee(String id, Employee updatedData) {
        return employeeRepository.findById(id).map(emp -> {
            emp.setName(updatedData.getName());
            emp.setMobile(updatedData.getMobile());
            emp.setRole(updatedData.getRole());
            emp.setSalaryType(updatedData.getSalaryType());
            emp.setSalaryAmount(updatedData.getSalaryAmount());
            emp.setPerHourRate(updatedData.getPerHourRate());
            emp.setJoiningDate(updatedData.getJoiningDate());
            emp.setStatus(updatedData.getStatus());
            emp.setAddress(updatedData.getAddress());
            emp.setUpdatedAt(LocalDateTime.now());
            return employeeRepository.save(emp);
        });
    }

    public boolean deleteEmployee(String id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
