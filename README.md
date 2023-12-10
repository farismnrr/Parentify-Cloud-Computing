### Create Credential Keys
---

- Open Link: https://console.cloud.google.com/iam-admin/serviceaccounts
- Click your project service account
- Click the button
- Click add key -> Create new key (Create 2 keys)
- Change the name to credentials.json
- Change the name of the other file to refresh-token.json
- put both files into the same directory as app.js

### MYSQL
---
- **Install MySQL**
```bash
sudo apt-get update
sudo apt-get full-upgrade -y
sudo apt auto-remove
sudo apt install mysql-server
sudo systemctl start mysql.service
sudo mysql
```

- **Create new user database**
```sql
Create new user database:
SELECT User, Host FROM mysql.user;
SET PASSWORD FOR 'parentify'@'localhost' = PASSWORD('YOUR_PASSWORD');
```
- **Grand the privilage for the user**
```sql
GRANT ALL PRIVILEGES ON your_database.* TO 'parentify'@'localhost';
FLUSH PRIVILEGES;
SHOW GRANTS FOR 'parentify'@'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'parentify'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```
- **Start the MySQL service**
```bash
sudo service mysql restart
sudo mysql -u parentify -p 
YOUR_PASSWORD
```

### NodeJS
---

- **Install NodeJS**
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

NODE_MAJOR=21
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

sudo apt-get update
sudo apt-get install nodejs -y
```

- **Install requirements**
```bash
sudo apt install git
git clone -b jwt-api https://github.com/Parentify/Parentify-Cloud-Computing.git
```

- **Install module**
```bash
cd Parentify-Cloud-Computing
npm install
```
