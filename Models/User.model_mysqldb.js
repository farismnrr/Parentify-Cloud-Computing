const connection = require('../helpers/init_mysqldb');
const { signAccessToken, signRefreshToken } = require('../helpers/jwt_helper');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

async function getUsers() {
    const [rows] = await connection.query('SELECT * FROM users');
    return rows;
}

async function getUser(id) {
    const [rows] = await connection.query(
        `SELECT * FROM users WHERE id = ${id}`,
    );
    return rows[0];
}

async function insertToken(userId, refreshToken) {
    const [result] = await connection.query(
        'UPDATE users SET token = ? WHERE id = ?',
        [refreshToken, userId],
    );

    const id = result.insertId;

    return { user: getUser(id), refreshToken };
}

async function createUser(username, email, password) {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.query(
        'INSERT INTO users (username, email, password, createdAt) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, new Date()],
    );

    const id = result.insertId;

    // Sign a JWT token with the user's ID
    const accessToken = await signAccessToken(id);
    const refreshToken = await signRefreshToken(id);
    await insertToken(id, refreshToken);

    // Check if the createdAt property exists in the result object
    const createdAt = result[0]?.createdAt || new Date();

    return {
        status: 'Success',
        message: 'User created successfully',
        data: {
            id: id,
            username: username,
            email: email,
            createdAt: createdAt,
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
    };
}

async function loginUser(identifier, password) {
    const existingUsers = await getUsers();

    const user = existingUsers.find(
        (user) => user.username === identifier || user.email === identifier,
    );

    if (!user) {
        throw createError.NotFound('Username or email not registered');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw createError.Unauthorized('Invalid password');
    }

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    await insertToken(user.id, refreshToken);

    return {
        status: 'Success',
        message: 'User logged in successfully',
        data: {
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
    };
}

async function logoutUser(refreshToken) {
    const [user] = await connection.query(
        'SELECT id, username, email FROM users WHERE token = ?',
        [refreshToken],
    );

    if (!user || !user.length) {
        throw createError.NotFound('User not found');
    }

    const userId = user[0].id;

    await connection.query('UPDATE users SET token = NULL WHERE id = ?', [
        userId,
    ]);

    return {
        status: 'Success',
        message: 'Logout successful',
        data: {
            id: user[0].id,
            username: user[0].username,
            email: user[0].email,
        },
    };
}

async function deleteUser(username, email, password) {
    const [user] = await connection.query(
        'SELECT id, username, email, password FROM users WHERE username = ? OR email = ?',
        [username, email],
    );

    if (!user || !user.length) {
        throw createError.NotFound('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
        throw createError.Unauthorized('Invalid password');
    }

    const isUsernameValid = username === user[0].username;

    if (!isUsernameValid) {
        throw createError.Unauthorized('Invalid username');
    }

    const isEmailValid = email === user[0].email;

    if (!isEmailValid) {
        throw createError.Unauthorized('Invalid email');
    }

    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [
        user[0].id,
    ]);

    if (result.affectedRows === 0) {
        throw createError.NotFound('User not found');
    }

    return {
        status: 'success',
        message: 'User deleted successfully',
        data: {
            id: user[0].id,
            username: user[0].username,
            email: user[0].email,
        },
    };
}

async function updateUserData(
    userId,
    { password, confirmPassword, username, email },
) {
    const user = await getUser(userId);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw createError.Unauthorized('Invalid password');
    }

    if (password !== confirmPassword) {
        throw createError.BadRequest('Passwords do not match');
    }

    const [result] = await connection.query(
        'UPDATE users SET username = ?, email = ?, ' +
            'updatedAt = CURRENT_TIMESTAMP, ' +
            'createdAt = IFNULL(createdAt, CURRENT_TIMESTAMP) ' +
            'WHERE id = ?',
        [username, email, userId],
    );

    if (result.affectedRows === 0) {
        throw createError.NotFound('User not found');
    }

    const createdAt = user.createdAt;
    const updatedAt = new Date();

    const accessToken = await signAccessToken(userId);
    const refreshToken = await signRefreshToken(userId);
    await insertToken(userId, refreshToken);

    return {
        status: 'Success',
        message: 'User updated successfully',
        data: {
            id: userId,
            username: username,
            email: email,
            createdAt: createdAt,
            updatedAt: updatedAt,
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
    };
}

async function updateUserPassword(
    userId,
    { password, newPassword, confirmPassword },
) {
    const user = await getUser(userId);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw createError.Unauthorized('Invalid password');
    }

    if (newPassword !== confirmPassword) {
        throw createError.BadRequest('Passwords do not match');
    }

    // Hashing password baru sebelum menyimpannya
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password di database
    const [result] = await connection.query(
        'UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP ' +
            'WHERE id = ?',
        [hashedPassword, userId],
    );

    if (result.affectedRows === 0) {
        throw createError.NotFound('User not found');
    }

    const createdAt = user.createdAt;
    const updatedAt = new Date();

    const accessToken = await signAccessToken(userId);
    const refreshToken = await signRefreshToken(userId);
    await insertToken(userId, refreshToken);

    return {
        status: 'Success',
        message: 'User password updated successfully',
        data: {
            id: userId,
            username: user.username, // Make sure to obtain 'username' from somewhere
            email: user.email, // Make sure to obtain 'email' from somewhere
            createdAt: createdAt,
            updatedAt: updatedAt,
            accessToken: accessToken,
            refreshToken: refreshToken,
        },
    };
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    loginUser,
    logoutUser,
    insertToken,
    updateUserData,
    updateUserPassword,
};
