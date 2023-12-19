#!/bin/bash

# Create log
echo "$(date): Update dan deploy berhasil" >> "execution_log.txt"

# Change Directory
cd Parentify-Cloud-Computing

# Restart mysql
sudo service mysql restart

# Update package information
sudo apt update

# Upgrade installed packages
sudo apt full-upgrade -y

# Install PM2 and library
sudo npm install
sudo npm install -g pm2

# Optional - Enable Startup Script
pm2 startup systemd

# Stop the PM2 process
pm2 stop parentify-api

# Delete the PM2 process
pm2 delete parentify-api

# Save the current PM2 processes
pm2 save --force

# Start the PM2 process using npm
pm2 start npm --name "parentify-api" -- run "start-prod"

# Save the current PM2 processes again
pm2 save
