#!/bin/bash

# Restart mysql
sudo service mysql restart

# Update package information
sudo apt update

# Upgrade installed packages
sudo apt full-upgrade -y

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
