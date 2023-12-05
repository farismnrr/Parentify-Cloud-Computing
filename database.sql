CREATE DATABASE parentify;
USE parentify;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email TEXT NOT NULL,
    password VARCHAR(255) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
    token TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL;
);
