const express = require('express');
const createError = require('http-errors');
// const User = require('../Models/User.model_mongodb');
const {
    registrationSchema,
    loginSchema,
    logoutSchema,
    deleteSchema,
    editUserSchema,
    resetSchema,
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

        const phoneNumber = req.body.phoneNumber;
        const otpCode = req.body.otpCode;

        // Validate phone number format
        if (!(phoneNumber.startsWith('+62') || phoneNumber.startsWith('0'))) {
            throw {
                status: 400,
                message:
                    'Invalid phone number format. Must start with +62 or 0.',
            };
        }

        const otpResult = await verifyOtpAsync(phoneNumber, otpCode);

        if (otpResult.message === 'approved') {
            const updateResult = await createUser(
                username,
                email,
                phoneNumber,
                password,
            );

            res.json({
                Status: otpResult.message,
                message: 'User updated successfully',
                ...updateResult, // Include the data directly
            });
        } else {
            // If OTP verification fails, return the OTP status only
            res.json({
                otpStatus: otpResult.message,
            });
        }
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

router.post('/send-otp', async (req, res) => {
    try {
        let phoneNumber = req.body.phoneNumber;

        const result = await sendOtpAsync(phoneNumber);
        res.status(result.status === 'Success' ? 200 : 400).json(result);
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        res.status(error.status || 500).json({
            Status: 'Error',
            Message: error.message || 'Internal Server Error',
        });
    }
});

router.post('/verify-otp', async (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const otpCode = req.body.otpCode;

    const result = await verifyOtpAsync(phoneNumber, otpCode);

    res.status(result.status).json({
        status: result.status === 200 ? 'Success' : 'Error',
        message: result.message,
    });
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
        const { email, username, newPassword, confirmPassword } =
            await resetSchema.validateAsync(req.body);

        const phoneNumber = req.body.phoneNumber;
        const otpCode = req.body.otpCode;

        if (!(email || username)) {
            throw createError.BadRequest('Please insert username or email');
        }

        const identifier = email || username;

        const otpResult = await verifyOtpAsync(phoneNumber, otpCode);

        // If OTP verification is successful, proceed to update password
        if (otpResult.message === 'approved') {
            const updateResult = await updateUserPassword(
                identifier,
                newPassword,
                confirmPassword,
            );

            // Directly return the data from updateUserPassword in the response
            res.json({
                Status: otpResult.message,
                message: 'User updated successfully',
                ...updateResult, // Include the data directly
            });
        } else {
            // If OTP verification fails, return the OTP status only
            res.json({
                otpStatus: otpResult.message,
            });
        }
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
