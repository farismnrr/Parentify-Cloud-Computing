const express = require('express');
const createError = require('http-errors');
// const User = require('../Models/User.model_mongodb');
const {
    registrationSchema,
    loginSchema,
    logoutSchema,
    deleteSchema,
} = require('../helpers/validation_schema');
const {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    loginUser,
    logoutUser,
    updateUserData,
    updateUserPassword,
} = require('../Models/User.model_mysqldb');
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require('../helpers/jwt_helper');

const router = express.Router();

router.get('/allUsers', async (req, res, next) => {
    try {
        const users = await getUsers();

        res.status(200).json({
            status: 'Success',
            message: 'Users retrieved successfully',
            totalResults: users.length,
            users: users,
        });
    } catch (error) {
        next(error);
    }
});

router.post('/register', async (req, res, next) => {
    try {
        // Validate request body using JOI schema
        const { error, value } = registrationSchema.validate(req.body);

        if (error) {
            throw createError(422, error.message);
        }

        const { username, email, password } = value;

        const existingUser = await getUsers();
        const usernameExist = existingUser.some(
            (user) => user.username === username,
        );
        const emailExist = existingUser.some((user) => user.email === email);

        if (usernameExist && emailExist) {
            throw createError(
                409,
                `${username} and ${email} are already registered`,
            );
        } else if (usernameExist) {
            throw createError(409, `${username} is already registered`);
        } else if (emailExist) {
            throw createError(409, `${email} is already registered`);
        }

        const result = await createUser(username, email, password);

        res.status(201).send(result);
    } catch (error) {
        res.status(error.status || 500).send({
            Status: 'Error',
            Message: error.message || 'Internal Server Error',
        });
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, username, password } = await loginSchema.validateAsync(
            req.body,
        );

        if (!(email || username)) {
            throw createError.BadRequest('Please insert username or email');
        }

        const identifier = email || username;
        const result = await loginUser(identifier, password);

        res.json(result);
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        res.status(error.status || 500).send({
            Status: 'Error',
            Message: error.message || 'Internal Server Error',
        });
    }
});

router.put('/:userId/user', async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const { password, confirmPassword, username, email } = req.body;

        // Update user data
        const result = await updateUserData(userId, {
            password,
            confirmPassword,
            username,
            email,
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.patch('/:userId/password', async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const { password, newPassword, confirmPassword } = req.body;

        // Update user data
        const result = await updateUserPassword(userId, {
            password,
            newPassword,
            confirmPassword,
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.patch('/refresh-token', async (req, res, next) => {
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

router.delete('/delete', async (req, res, next) => {
    try {
        // Validasi input menggunakan JOI
        const { error } = deleteSchema.validate(req.body);
        if (error) {
            throw createError(400, error.details[0].message);
        }

        const { username, email, password } = req.body;
        const result = await deleteUser(username, email, password);

        res.json(result);
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        res.status(error.status || 500).send({
            Status: 'Error',
            Message: error.message || 'Internal Server Error',
        });
    }
});

router.delete('/logout', async (req, res, next) => {
    try {
        // Ambil refreshToken dari body request
        const { refreshToken } = await logoutSchema.validateAsync(req.body);

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        // Lakukan logout user
        const result = await logoutUser(refreshToken);

        // Respon berhasil logout
        res.json(result);
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        res.status(error.status || 500).json({
            Status: 'Error',
            Message: error.message || 'Internal Server Error',
        });
    }
});

module.exports = router;
