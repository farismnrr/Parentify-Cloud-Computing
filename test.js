const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Middleware untuk mengurai body dari POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'parentify',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

app.post('/food/addFood', (req, res) => {
    const { food_name } = req.body;

    console.log('Received POST request with body:', food_name);

    if (!food_name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const sql = 'INSERT INTO foods (food_name) VALUES (?)';
    db.query(sql, [food_name], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        console.log('Food added successfully');
        res.status(201).json({ message: 'Food added successfully' });
        // res.send('POST request received successfully'); // Hapus baris ini
    });
    // Hapus baris res.send('POST request received successfully');
});

// Endpoint untuk menerima POST request
app.post('/add', (req, res) => {
    // Menampilkan body dari POST request ke dalam console.log
    console.log('Received POST request with body:', req.body);

    // Mengirim respons ke client
    res.send('POST request received successfully');
});

// Port yang akan digunakan oleh server
const PORT = 3000;

// Menjalankan server pada port tertentu
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
