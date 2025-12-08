-- Database Schema for Aveti Learning Application Form
-- Compatible with MySQL/MariaDB (Hostinger)

-- Create database (uncomment if you need to create the database)
-- CREATE DATABASE IF NOT EXISTS aveti_learning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE aveti_learning;

-- Create applications table
CREATE TABLE IF NOT EXISTS `applications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `age` int(11) NOT NULL,
  `qualification` varchar(255) NOT NULL,
  `graduation_year` int(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `video_filename` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_uploaded_at` (`uploaded_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Create index for faster queries
-- CREATE INDEX idx_email ON applications(email);
-- CREATE INDEX idx_uploaded_at ON applications(uploaded_at);

