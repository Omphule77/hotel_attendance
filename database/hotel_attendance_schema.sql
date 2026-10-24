-- ======================================================================
-- हॉटेल कर्मचारी हजेरी व पगार व्यवस्थापन प्रणाली (Hotel Attendance & Salary System)
-- MySQL डेटाबेस टेबल निर्मिती स्क्रिप्ट (Database Schema Script)
-- ======================================================================

-- १. डेटाबेस तयार करा (Create Database if not exists)
CREATE DATABASE IF NOT EXISTS hotel_attendance 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE hotel_attendance;

-- २. व्यवस्थापक/अॅडमिन टेबल (Admins Table for Login & Registration)
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE COMMENT 'लॉगिन युझरनेम किंवा ईमेल',
    password VARCHAR(255) NOT NULL COMMENT 'पासवर्ड',
    full_name VARCHAR(150) NOT NULL COMMENT 'व्यवस्थापकाचे पूर्ण नाव',
    hotel_name VARCHAR(200) NOT NULL COMMENT 'हॉटेलचे नाव (उदा. हॉटेल मराठा, हॉटेल स्वागत)',
    mobile VARCHAR(20) COMMENT 'मोबाईल नंबर',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'नोंदणी तारीख'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='अॅडमिन माहिती टेबल';

-- ३. कर्मचारी टेबल (Employees Table)
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL COMMENT 'कर्मचाऱ्याचे पूर्ण नाव',
    mobile VARCHAR(20) NOT NULL COMMENT 'मोबाईल नंबर',
    role VARCHAR(80) NOT NULL DEFAULT 'वेटर' COMMENT 'पद (वेटर / आचारी / क्लिनर / कॅशियर / व्यवस्थापक)',
    salary_type ENUM('DAILY', 'MONTHLY') NOT NULL DEFAULT 'DAILY' COMMENT 'पगार प्रकार: DAILY (दररोज) किंवा MONTHLY (मासिक)',
    salary_amount DECIMAL(10, 2) NOT NULL COMMENT 'पगार रक्कम (दररोजचा दर किंवा मासिक पगार)',
    per_hour_rate DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'प्रति तास दर (तासानुसार कामासाठी)',
    joining_date DATE NOT NULL COMMENT 'कामावर रुजू झाल्याची तारीख',
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE' COMMENT 'स्थिती: ACTIVE (सक्रिय), INACTIVE (बंद)',
    address VARCHAR(255) DEFAULT NULL COMMENT 'पत्ता',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='हॉटेल कर्मचारी तपशील';

-- ४. हजेरी टेबल (Daily Attendance Table)
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL COMMENT 'कर्मचारी आयडी',
    attendance_date DATE NOT NULL COMMENT 'हजेरीची तारीख',
    status ENUM('PRESENT', 'ABSENT', 'HALF_DAY') NOT NULL DEFAULT 'PRESENT' COMMENT 'हजेरी स्थिती: PRESENT (हजर), ABSENT (गैरहजर), HALF_DAY (अर्धा दिवस)',
    hours_worked DECIMAL(4, 1) DEFAULT 8.0 COMMENT 'कामाचे एकूण तास',
    notes VARCHAR(255) DEFAULT NULL COMMENT 'काही विशेष शेरा / टिप',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT uq_emp_date UNIQUE (employee_id, attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='दैनिक हजेरी नोंदणी';

-- ५. आगाऊ रक्कम / उचल टेबल (Salary Advances Table - ऐच्छिक परंतु हॉटेलसाठी अतिशय उपयुक्त)
CREATE TABLE IF NOT EXISTS salary_advances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL COMMENT 'कर्मचारी आयडी',
    advance_date DATE NOT NULL COMMENT 'उचल घेतल्याची तारीख',
    amount DECIMAL(10, 2) NOT NULL COMMENT 'घेतलेली उचल रक्कम',
    reason VARCHAR(255) DEFAULT 'मासिक उचल' COMMENT 'उचल घेण्याचे कारण',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_advance_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='कर्मचाऱ्यांनी घेतलेली उचल / अॅडव्हान्स';
