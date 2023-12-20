const express = require('express');
const createError = require('http-errors');
const {
    registrationSchema,
    loginSchema,
    logoutSchema,
    deleteSchema,
    editUserSchema,
    resetSchema,
    getresetSchema,
} = require('../helpers/validation_schema');
const {
    getUsers,
    getUser,
    getUpdatePassword,
    createUser,
    deleteUser,
    loginUser,
    logoutUser,
    updateUserData,
    updateUserPassword,
    sendOtpAsync,
    verifyOtpAsync,
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

        const updateResult = await createUser(
            username,
            email,
            phoneNumber,
            password,
        );

        res.json({ updateResult });
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

router.put('/edit/user', async (req, res, next) => {
    try {
        const {
            refreshToken,
            oldPassword,
            newUsername,
            newPassword,
            newEmail,
        } = await editUserSchema.validateAsync(req.body);

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }

        // Update user data
        const result = await updateUserData(
            refreshToken,
            oldPassword,
            newUsername,
            newPassword,
            newEmail,
        );

        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.patch('/edit/password', async (req, res, next) => {
    try {
        const { email, username, newPassword, confirmPassword, phoneNumber } =
            await resetSchema.validateAsync(req.body);

        if (!(email || username)) {
            throw createError.BadRequest('Please insert username or email');
        }

        const identifier = email || username;

        const updateResult = await updateUserPassword(
            identifier,
            newPassword,
            confirmPassword,
            phoneNumber,
        );

        // Directly return the data from updateUserPassword in the response
        res.json({ updateResult });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        res.status(error.status || 500).send({
            Status: 'Error',
            Message: error.message || 'Internal Server Error',
        });
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

router.delete('/:userId/delete', async (req, res, next) => {
    try {
        const userId = req.params.userId;
        // Validasi input menggunakan JOI

        const result = await deleteUser(userId);

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
