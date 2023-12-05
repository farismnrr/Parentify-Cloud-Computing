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

async function createUser(username, email, password) {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
    );
    const id = result.insertId;

    // Sign a JWT token with the user's ID
    const accessToken = await signAccessToken(id);
    const refreshToken = await signRefreshToken(id);
    await insertToken(id, refreshToken);

    return { user: getUser(id), accessToken, refreshToken };
}

async function loginUser(identifier, password) {
    const existingUsers = await getUsers();

    // Find the user by either username or email
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

    // Sign a JWT token with the user's ID
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    await insertToken(user.id, refreshToken);

    return {
        user: { id: user.id, username: user.username, email: user.email },
        accessToken,
        refreshToken,
    };
}

async function logoutUser(refreshToken) {
    const [user] = await connection.query(
        'SELECT id FROM users WHERE token = ?',
        [refreshToken],
    );

    const userId = user[0].id;

    await connection.query('UPDATE users SET token = NULL WHERE id = ?', [
        userId,
    ]);

    return { user: getUser(userId) };
}

async function insertToken(userId, refreshToken) {
    const [result] = await connection.query(
        'UPDATE users SET token = ? WHERE id = ?',
        [refreshToken, userId],
    );

    const id = result.insertId;

    return { user: getUser(id), refreshToken };
}

module.exports = { getUsers, createUser, loginUser, logoutUser, insertToken };
