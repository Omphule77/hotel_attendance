package com.hotel.attendance.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.attendance.model.Admin;
import com.hotel.attendance.model.Attendance;
import com.hotel.attendance.model.Employee;
import com.hotel.attendance.model.SalaryAdvance;
import com.hotel.attendance.repository.AdminRepository;
import com.hotel.attendance.repository.AttendanceRepository;
import com.hotel.attendance.repository.EmployeeRepository;
import com.hotel.attendance.repository.SalaryAdvanceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
@Order(1)
public class MongoDataMigrator implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final SalaryAdvanceRepository salaryAdvanceRepository;
    private final ObjectMapper objectMapper;

    public MongoDataMigrator(AdminRepository adminRepository,
                             EmployeeRepository employeeRepository,
                             AttendanceRepository attendanceRepository,
                             SalaryAdvanceRepository salaryAdvanceRepository,
                             ObjectMapper objectMapper) {
        this.adminRepository = adminRepository;
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.salaryAdvanceRepository = salaryAdvanceRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) {
        try {
            // फक्त जर MongoDB मध्ये कर्मचारी नसतील तरच बॅकअपमधून डेटा माइग्रेट करा
            if (employeeRepository.count() > 0) {
                return;
            }

            JsonNode root = null;
            try {
                ClassPathResource resource = new ClassPathResource("migration/mysql_exported_data.json");
                if (resource.exists()) {
                    try (InputStream is = resource.getInputStream()) {
                        root = objectMapper.readTree(is);
                    }
                }
            } catch (Exception ignored) {}

            if (root == null) {
                File backupFile = new File("migration/mysql_exported_data.json");
                if (!backupFile.exists()) {
                    backupFile = new File("../migration/mysql_exported_data.json");
                }
                if (backupFile.exists()) {
                    root = objectMapper.readTree(backupFile);
                }
            }

            if (root == null) {
                return;
            }

            System.out.println(">>> MongoDB Atlas मध्ये MySQL डेटा स्थलांतरित (Migrate) करत आहे...");

            // 1. Admins Migration
            JsonNode adminsNode = root.get("admins");
            if (adminsNode != null && adminsNode.isArray()) {
                for (JsonNode adm : adminsNode) {
                    String username = adm.get("username").asText();
                    if (!adminRepository.existsByUsername(username)) {
                        Admin admin = new Admin(
                                username,
                                adm.get("password").asText(),
                                adm.get("full_name").asText(),
                                adm.get("hotel_name").asText(),
                                adm.has("mobile") ? adm.get("mobile").asText() : ""
                        );
                        adminRepository.save(admin);
                    }
                }
            }

            // 2. Employees Migration and ID Mapping
            Map<String, String> empIdMap = new HashMap<>();
            JsonNode employeesNode = root.get("employees");
            if (employeesNode != null && employeesNode.isArray()) {
                for (JsonNode emp : employeesNode) {
                    String oldId = emp.get("id").asText();
                    Employee employee = new Employee();
                    employee.setName(emp.get("name").asText());
                    employee.setMobile(emp.get("mobile").asText());
                    employee.setRole(emp.has("role") ? emp.get("role").asText() : "वेटर");
                    employee.setSalaryType(emp.has("salary_type") ? emp.get("salary_type").asText() : "DAILY");
                    employee.setSalaryAmount(BigDecimal.valueOf(emp.has("salary_amount") ? emp.get("salary_amount").asDouble() : 0.0));
                    employee.setPerHourRate(BigDecimal.valueOf(emp.has("per_hour_rate") ? emp.get("per_hour_rate").asDouble() : 0.0));
                    
                    if (emp.has("joining_date") && !emp.get("joining_date").isNull()) {
                        employee.setJoiningDate(LocalDate.parse(emp.get("joining_date").asText().substring(0, 10)));
                    } else {
                        employee.setJoiningDate(LocalDate.now());
                    }
                    employee.setStatus(emp.has("status") ? emp.get("status").asText() : "ACTIVE");
                    employee.setAddress(emp.has("address") ? emp.get("address").asText() : "");
                    employee.setCreatedAt(LocalDateTime.now());
                    employee.setUpdatedAt(LocalDateTime.now());

                    Employee saved = employeeRepository.save(employee);
                    empIdMap.put(oldId, saved.getId());
                }
                System.out.println(">>> " + empIdMap.size() + " कर्मचारी MongoDB Atlas मध्ये सेव्ह केले!");
            }

            // 3. Attendance Migration
            JsonNode attendanceNode = root.get("attendance");
            if (attendanceNode != null && attendanceNode.isArray()) {
                int attCount = 0;
                for (JsonNode att : attendanceNode) {
                    String oldEmpId = att.get("employee_id").asText();
                    String newEmpId = empIdMap.getOrDefault(oldEmpId, oldEmpId);
                    LocalDate date = LocalDate.parse(att.get("attendance_date").asText().substring(0, 10));

                    Attendance attendance = new Attendance(
                            newEmpId,
                            date,
                            att.has("status") ? att.get("status").asText() : "PRESENT",
                            att.has("hours_worked") ? att.get("hours_worked").asDouble() : 8.0,
                            att.has("notes") ? att.get("notes").asText() : ""
                    );
                    attendanceRepository.save(attendance);
                    attCount++;
                }
                System.out.println(">>> " + attCount + " हजेरी रेकॉर्ड्स MongoDB Atlas मध्ये सेव्ह केले!");
            }

            // 4. Advances Migration
            JsonNode advancesNode = root.get("salary_advances");
            if (advancesNode != null && advancesNode.isArray()) {
                int advCount = 0;
                for (JsonNode adv : advancesNode) {
                    String oldEmpId = adv.get("employee_id").asText();
                    String newEmpId = empIdMap.getOrDefault(oldEmpId, oldEmpId);
                    LocalDate date = LocalDate.parse(adv.get("advance_date").asText().substring(0, 10));
                    BigDecimal amount = BigDecimal.valueOf(adv.get("amount").asDouble());
                    String reason = adv.has("reason") ? adv.get("reason").asText() : "उचल";

                    SalaryAdvance advance = new SalaryAdvance(newEmpId, date, amount, reason);
                    salaryAdvanceRepository.save(advance);
                    advCount++;
                }
                System.out.println(">>> " + advCount + " उचल रेकॉर्ड्स MongoDB Atlas मध्ये सेव्ह केले!");
            }

            System.out.println("✅ MongoDB Atlas मध्ये सर्व डेटा यशस्वीरित्या स्थलांतरित झाला!");

        } catch (Exception e) {
            System.err.println("डेटा माइग्रेशन दरम्यान त्रुटी: " + e.getMessage());
        }
    }
}
