const JWT = require('jsonwebtoken');
const createError = require('http-errors');

const jsonCredentials = require('../credentials');
const jsonRefreshToken = require('../refresh-token');

const usedRefreshTokens = new Set();

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = { audience: userId };
            const secret = jsonCredentials.private_key;
            const options = {
                expiresIn: '10s',
                issuer: 'farismnrr.my.id',
                algorithm: 'RS256',
                header: {
                    kid: jsonCredentials.private_key_id,
                },
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);
                    reject(createError.InternalServerError());
                }
                resolve(token);
            });
        });
    },

    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization'])
            return next(createError.Unauthorized());

        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');

        if (bearerToken.length !== 2 || bearerToken[0] !== 'Bearer') {
            return next(createError.Unauthorized());
        }

        const token = bearerToken[1];

        JWT.verify(token, jsonCredentials.private_key, (err, payload) => {
            if (err) {
                const message =
                    err.name === 'JsonWebTokenError'
                        ? 'Unauthorized'
                        : err.message;
                return next(createError.Unauthorized(message));
            }
            req.payload = payload;
            next();
        });
    },

    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = { audience: userId };
            const secret = jsonRefreshToken.private_key;
            const options = {
                expiresIn: '1y',
                issuer: 'farismnrr.my.id',
                algorithm: 'RS256',
                header: {
                    kid: jsonRefreshToken.private_key_id,
                },
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);
                    reject(createError.InternalServerError());
                }
                resolve(token);
            });
        });
    },

    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            if (usedRefreshTokens.has(refreshToken)) {
                return reject(
                    createError.Unauthorized(
                        'Refresh token has already been used.',
                    ),
                );
            }

            JWT.verify(
                refreshToken,
                jsonRefreshToken.private_key,
                (err, payload) => {
                    if (err) return reject(createError.Unauthorized());
                    const userId = payload.aud;

                    usedRefreshTokens.add(refreshToken);

                    resolve(userId);
                },
            );
        });
    },
};
