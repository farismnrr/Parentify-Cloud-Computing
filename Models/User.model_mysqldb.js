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

async function createUser(username, email, password, confirmPassword) {
    // Hash the password before storing it
    if (password !== confirmPassword) {
        throw new Error('Password and confirm password do not match');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.query(
        'INSERT INTO users (username, email, phoneNumber, password, createdAt) VALUES (?, ?, ?, ?, ?)',
        [username, email, phoneNumber, hashedPassword, new Date()],
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
            phoneNumber: phoneNumber,
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
            phoneNumber: user.phoneNumber,
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
            id: userId,
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

async function deleteUser(userId) {
    const user = await getUser(userId);

    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [
        user.id,
    ]);

    if (result.affectedRows === 0) {
        throw createError.NotFound('User not found');
    }

    return {
        status: 'success',
        message: 'User deleted successfully',
        data: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
    };
}

async function updateUserData(
    refreshToken,
    oldPassword,
    newUsername,
    newPassword,
    newEmail,
) {
    const [user] = await connection.query(
        'SELECT * FROM users WHERE token = ?',
        [refreshToken],
    );

    if (!user || !user.length) {
        throw createError.NotFound('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user[0].password);

    if (!isPasswordValid) {
        throw createError.Unauthorized('Invalid password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await connection.query(
        'UPDATE users SET username = ?, password = ?, email = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [newUsername, hashedPassword, newEmail, user[0].id],
    );

    const accessToken = await signAccessToken(user[0].id);
    const newRefreshToken = await signRefreshToken(user[0].id);
    await insertToken(user[0].id, newRefreshToken);

    const [newData] = await connection.query(
        'SELECT * FROM users WHERE id = ?',
        [user[0].id],
    );

    return {
        status: 'Success',
        message: 'User updated successfully',
        data: {
            id: newData[0].id,
            username: newData[0].username,
            email: newData[0].email,
            createdAt: newData[0].createdAt,
            updatedAt: newData[0].updatedAt,
            accessToken: accessToken,
            refreshToken: newRefreshToken,
        },
    };
}

async function updateUserPassword(identifier, newPassword, confirmPassword) {
    const existingUsers = await getUsers();

    const user = existingUsers.find(
        (user) => user.username === identifier || user.email === identifier,
    );

    if (!user) {
        throw createError.NotFound('Username or email not registered');
    }

    if (newPassword !== confirmPassword) {
        throw new Error('Password and confirm password do not match');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const userId = user.id;

    await connection.query(
        'UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [hashedPassword, userId],
    );

    const [newData] = await connection.query(
        'SELECT * FROM users WHERE id = ?',
        [userId],
    );

    return {
        message: 'User updated successfully',
        data: {
            id: newData[0].id,
            username: newData[0].username,
            email: newData[0].email,
            createdAt: newData[0].createdAt,
            updatedAt: newData[0].updatedAt,
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
