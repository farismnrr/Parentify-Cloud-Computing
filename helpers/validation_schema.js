const Joi = require('@hapi/joi');

const authSchema = Joi.object({
    username: Joi.string().alphanum().lowercase().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required(),
});

const authSchema2 = Joi.object({
    username: Joi.string().alphanum().lowercase(),
    email: Joi.string().email().lowercase(),
    password: Joi.string().min(8).required(),
});

const authSchema3 = Joi.object({
    refreshToken: Joi.string().required(),
});

module.exports = { authSchema, authSchema2, authSchema3 };
