package com.hotel.attendance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HotelAttendanceApplication {

    public static void main(String[] args) {
        SpringApplication.run(HotelAttendanceApplication.class, args);
        System.out.println("==================================================");
        System.out.println("हॉटेल कर्मचारी हजेरी व पगार प्रणाली सुरू झाली आहे!");
        System.out.println("Backend running on: http://localhost:8080");
        System.out.println("==================================================");
    }
}
