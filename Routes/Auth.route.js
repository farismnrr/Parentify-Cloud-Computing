const express = require('express');
const createError = require('http-errors');
// const User = require('../Models/User.model_mongodb');
const { authSchema, authSchema2 } = require('../helpers/validation_schema');
const {
    getUsers,
    createUser,
    loginUser,
} = require('../Models/User.model_mysqldb');
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require('../helpers/jwt_helper');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    try {
        const { username, email, password } = await authSchema.validateAsync(
            req.body,
        );

        const existingUser = await getUsers();
        const usernameExist = existingUser.some(
            (user) => user.username === username,
        );
        const emailExist = existingUser.some((user) => user.email === email);

        if (usernameExist && emailExist) {
            throw createError.Conflict(
                `${username} and ${email} are already registered`,
            );
        } else if (usernameExist) {
            throw createError.Conflict(`${username} is already registered`);
        } else if (emailExist) {
            throw createError.Conflict(`${email} is already registered`);
        }

        const { user, accessToken, refreshToken } = await createUser(
            username,
            email,
            password,
        );

        res.status(201).send({ user, accessToken, refreshToken });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, username, password } = await authSchema2.validateAsync(
            req.body,
        );

        if (!(email || username)) {
            throw createError.BadRequest('Please insert username or email');
        }

        const identifier = email || username;
        const { user, accessToken, refreshToken } = await loginUser(
            identifier,
            password,
        );

        res.status(200).send({ user, accessToken, refreshToken });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
});

router.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw createError.BadRequest();
        const userId = await verifyRefreshToken(refreshToken);

        const accessToken = await signAccessToken(userId);
        const refToken = await signRefreshToken(userId);
        res.send({ accessToken, refToken });
    } catch (error) {
        next(error);
    }
});

router.delete('/logout', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw createError.BadRequest();
        const userId = await verifyRefreshToken(refreshToken);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
