const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const FoodRoutes = require('./Routes/Food.route');
const bodyParser = require('body-parser');

const app = express();

require('dotenv').config();
require('./helpers/init_mysqldb');

app.use(morgan('dev'));
// app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res, next) => {
    res.send('Server connected');
});

app.use('/food', FoodRoutes);

app.use(async (req, res, next) => {
    next(createError.NotFound());
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
