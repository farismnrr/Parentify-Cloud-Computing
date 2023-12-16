const Joi = require('@hapi/joi');

const createFoodSchema = Joi.object({
    img: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    description: Joi.string().required(),
    nutrition: Joi.string().required(),
    information: Joi.array().items(Joi.string()).required(),
    status: Joi.array().items(Joi.string()).required(),
    texture: Joi.array().items(Joi.string()).required(),
});

const deleteFoodSchema = Joi.object({
    name: Joi.string().required(),
});

const registrationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().optional(),
    username: Joi.string().alphanum().min(3).max(30).optional(),
    password: Joi.string().min(6).required(),
});

const logoutSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

const deleteSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).lowercase(),
    email: Joi.string().email().lowercase(),
    password: Joi.string().required().min(6),
});

module.exports = {
    createFoodSchema,
    deleteFoodSchema,
    registrationSchema,
    loginSchema,
    logoutSchema,
    deleteSchema,
};
