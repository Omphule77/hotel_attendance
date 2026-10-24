package com.hotel.attendance.controller;

import com.hotel.attendance.dto.ApiResponse;
import com.hotel.attendance.model.Employee;
import com.hotel.attendance.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Employee>>> getAllEmployees() {
        List<Employee> list = employeeService.getAllEmployees();
        return ResponseEntity.ok(ApiResponse.ok("कर्मचाऱ्यांची यादी", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Employee>> getEmployeeById(@PathVariable String id) {
        return employeeService.getEmployeeById(id)
                .map(emp -> ResponseEntity.ok(ApiResponse.ok("कर्मचारी तपशील", emp)))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error("कर्मचारी सापडला नाही")));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Employee>> createEmployee(@RequestBody Employee employee) {
        if (employee.getName() == null || employee.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("कर्मचाऱ्याचे नाव आवश्यक आहे"));
        }
        if (employee.getMobile() == null || employee.getMobile().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("मोबाईल नंबर आवश्यक आहे"));
        }
        if (employee.getSalaryAmount() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("पगार रक्कम आवश्यक आहे"));
        }

        Employee saved = employeeService.saveEmployee(employee);
        return ResponseEntity.ok(ApiResponse.ok("कर्मचारी यशस्वीरित्या जोडला गेला!", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Employee>> updateEmployee(@PathVariable String id, @RequestBody Employee updated) {
        return employeeService.updateEmployee(id, updated)
                .map(emp -> ResponseEntity.ok(ApiResponse.ok("कर्मचाऱ्याची माहिती अपडेट झाली!", emp)))
                .orElse(ResponseEntity.status(404).body(ApiResponse.error("कर्मचारी सापडला नाही")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable String id) {
        boolean deleted = employeeService.deleteEmployee(id);
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.ok("कर्मचारी हटवला गेला!", null));
        } else {
            return ResponseEntity.status(404).body(ApiResponse.error("कर्मचारी सापडला नाही"));
        }
    }
}
