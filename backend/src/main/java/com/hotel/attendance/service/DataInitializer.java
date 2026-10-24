package com.hotel.attendance.service;

import com.hotel.attendance.model.Admin;
import com.hotel.attendance.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;

    public DataInitializer(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public void run(String... args) {
        // डीफॉल्ट अॅडमिन खाते (नसल्यास)
        if (adminRepository.count() == 0) {
            Admin defaultAdmin = new Admin(
                    "admin",
                    "admin123",
                    "व्यवस्थापक (Admin)",
                    "हॉटेल व्यवस्थापन",
                    "9876543210"
            );
            adminRepository.save(defaultAdmin);
            System.out.println(">>> MongoDB अॅडमिन खाते तयार: admin / admin123");
        }
    }
}
