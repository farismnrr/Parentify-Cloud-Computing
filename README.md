# MYSQL
---
- **Update and Install MySQL**
```bash
sudo apt-get update
sudo apt-get full-upgrade -y
```
```bash
sudo apt auto-remove
sudo apt install mysql-server -y
```
```bash
sudo systemctl start mysql.service
sudo mysql
```

- **Create new user database**
```sql
-- Create new user
CREATE USER 'parentify'@'localhost' IDENTIFIED BY 'Parentify-CH2-PS318';

-- Grant necessary privileges to the user (adjust privileges as needed)
GRANT SELECT, INSERT, UPDATE, DELETE ON your_database.* TO 'parentify'@'localhost';

-- Display user information
SELECT User, Host FROM mysql.user WHERE User = 'parentify';
```

- **Grand the privilage for the user**
```sql
GRANT ALL PRIVILEGES ON your_database.* TO 'parentify'@'localhost';
FLUSH PRIVILEGES;
SHOW GRANTS FOR 'parentify'@'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'parentify'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
exit;
```

- **Start the MySQL service**
```bash
sudo service mysql restart
sudo mysql -u parentify -p 
YOUR_PASSWORD
```
- **See file database.sql to create database and table**


# NodeJS
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
git clone https://github.com/Parentify/Parentify-Cloud-Computing.git
```

# Create Credential Keys
---
- Open Link: https://console.cloud.google.com/iam-admin/serviceaccounts
- Click your project service account
- Click the button
- Click add key -> Create new key (Create 2 keys)
- Change the name to credentials.json
- Change the name of the other file to refresh-token.json
- put both files into the same directory as app.js

# Create Automatic Update and Deploy
---
- Move the bash into the main directory
- See the directory by command `pwd` and save the directory
- Move the bash file into main directory
```bash
sudo mv update_and_deploy.sh ../update_and_deploy.sh
crontab -e
```

- Open crontab to create new log
```bash
0 * * * * /bin/bash /home/YOUR_VM_DIRECTORY/update_and_deploy.sh
```
- Save the crontab by pressing `ctrl + s` and `ctrl + x`
  
```bash
chmod +x update_and_deploy.sh
./update_and_deploy.sh
```

# Food API
---
- **API Semua Makanan:** http://34.30.213.144:3001/food/allFoods?api_key=YOUR_API_KEY
- **API Berdasarkan Nama Makanan (ganti `namaMakanan` dengan nama sebenarnya):** `http://34.30.213.144/3001/food/getClasification?food_name=namaMakanan?api_key=YOUR_API_KEY`
- **Contoh Penggunaan:** http://34.30.213.144/3001/food/getClasification?food_name=berasPutih?api_key=YOUR_API_KEY (Mengambil informasi tentang beras putih)

# JWT API
---
### Server Test
- **Method:** GET
- **URL:** http://34.30.213.144:3001
- **Authorization:** Bearer YOUR_TOKEN

### Login Route
- **Method:** POST
- **URL:** http://34.30.213.144:3001/auth/login?api_key=YOUR_API_KEY
- **Content-Type:** application/json

    ```json
    {
        "username": "farismnrr",
        "email": "test@gmail.com",
        "password": "root1a231231"
    }
    ```

### Register Route
- **Method:** POST
- **URL:** http://34.30.213.144:3001/auth/register?api_key=YOUR_API_KEY
- **Content-Type:** application/json

    ```json
    {
        "username": "farismnrrr",
        "email": "testr@gmail.com",
        "password": "root1a231231"
    }
    ```

### Refresh Token Route
- **Method:** POST
- **URL:** http://34.30.213.144:3001/auth/refresh-token?api_key=YOUR_API_KEY
- **Content-Type:** application/json

    ```json
    {
        "refreshToken": "YOUR_REFRESH_TOKEN"
    }
    ```

### Logout Route
- **Method:** DELETE
- **URL:** http://34.30.213.144:3001/auth/logout?api_key=YOUR_API_KEY
- **Content-Type:** application/json

    ```json
    {
        "refreshToken": "YOUR_REFRESH_TOKEN"
    }
    ```
