const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const AuthRoutes = require('./Routes/Auth.route');
const FoodRoutes = require('./Routes/Food.route');
const ArticleRoutes = require('./Routes/Article.route');

const app = express();

const { verifyAccessToken } = require('./helpers/jwt_helper');

require('dotenv').config();
require('./helpers/init_mysqldb');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const validateAPIKey = (req, res, next) => {
    const apiKeyFromURL = req.query.api_key;
    const apiKeyFromCredentials = require('./credentials.json').private_key_id;
    const apiKeyFromRefreshToken =
        require('./refresh-token.json').private_key_id;

    const combinedAPIKey = apiKeyFromCredentials + apiKeyFromRefreshToken;

    if (!apiKeyFromURL || apiKeyFromURL !== combinedAPIKey) {
        return next(createError.Unauthorized('Invalid API key'));
    }

    next();
};

app.get('/', verifyAccessToken, async (req, res, next) => {
    res.send('Server connected');
});

app.use(validateAPIKey);
app.use('/auth', AuthRoutes);
app.use('/food', FoodRoutes);
app.use('/article', ArticleRoutes);

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
