package com.hotel.attendance.dto;

public class RegisterRequest {
    private String username;
    private String password;
    private String fullName;
    private String hotelName;
    private String mobile;

    public RegisterRequest() {}

    public RegisterRequest(String username, String password, String fullName, String hotelName, String mobile) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.hotelName = hotelName;
        this.mobile = mobile;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
}
