package com.hotel.attendance.controller;

import com.hotel.attendance.dto.ApiResponse;
import com.hotel.attendance.dto.LoginRequest;
import com.hotel.attendance.dto.RegisterRequest;
import com.hotel.attendance.model.Admin;
import com.hotel.attendance.repository.AdminRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AdminRepository adminRepository;

    public AuthController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("युझरनेम आणि पासवर्ड आवश्यक आहे"));
        }

        Optional<Admin> adminOpt = adminRepository.findByUsername(request.getUsername().trim());
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(401).body(ApiResponse.error("असा कोणताही व्यवस्थापक/अॅडमिन सापडला नाही"));
        }

        Admin admin = adminOpt.get();
        if (!admin.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(401).body(ApiResponse.error("पासवर्ड चुकीचा आहे"));
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", admin.getId());
        userData.put("username", admin.getUsername());
        userData.put("fullName", admin.getFullName());
        userData.put("hotelName", admin.getHotelName());
        userData.put("mobile", admin.getMobile());

        return ResponseEntity.ok(ApiResponse.ok("लॉगिन यशस्वी झाले!", userData));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty() ||
            request.getPassword() == null || request.getPassword().trim().isEmpty() ||
            request.getHotelName() == null || request.getHotelName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("कृपया सर्व आवश्यक माहिती भरा (युझरनेम, पासवर्ड आणि हॉटेलचे नाव)"));
        }

        if (adminRepository.existsByUsername(request.getUsername().trim())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("हे युझरनेम आधीच वापरले गेले आहे. कृपया दुसरे निवडा."));
        }

        Admin admin = new Admin(
                request.getUsername().trim(),
                request.getPassword(),
                request.getFullName() != null ? request.getFullName().trim() : "हॉटेल व्यवस्थापक",
                request.getHotelName().trim(),
                request.getMobile() != null ? request.getMobile().trim() : ""
        );

        Admin saved = adminRepository.save(admin);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", saved.getId());
        userData.put("username", saved.getUsername());
        userData.put("fullName", saved.getFullName());
        userData.put("hotelName", saved.getHotelName());
        userData.put("mobile", saved.getMobile());

        return ResponseEntity.ok(ApiResponse.ok("नवीन खाते यशस्वीरित्या तयार झाले! आपण आता लॉगिन करू शकता.", userData));
    }
}
