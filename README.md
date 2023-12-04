### MYSQL
---

- **Create new user database**
```db
Create new user database:
SELECT User, Host FROM mysql.user;
SET PASSWORD FOR 'parentify'@'localhost' = PASSWORD('YOUR_PASSWORD');
```
- **Grand the privilage for the user**
```
GRANT ALL PRIVILEGES ON your_database.* TO 'parentify'@'localhost';
FLUSH PRIVILEGES;
SHOW GRANTS FOR 'parentify'@'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'parentify'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```
- **Start the MySQL service**
```
sudo service mysql restart
sudo mysql -u parentify -p 
YOUR_PASSWORD
```
