CREATE DATABASE IF NOT EXISTS parentify;
USE parentify;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email TEXT NOT NULL,
    password VARCHAR(255) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    token TEXT NULL
);

CREATE TABLE IF NOT EXISTS foods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    img VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    description TEXT,
    nutrition VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS classification (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    information TEXT,
    status VARCHAR(255),
    texture VARCHAR(255)
);
