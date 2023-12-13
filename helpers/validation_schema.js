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
    img: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string().required(),
    description: Joi.string().required(),
    nutrition: Joi.string().required(),
    information: Joi.array().items(Joi.string()).required(),
    status: Joi.array().items(Joi.string()).required(),
    texture: Joi.array().items(Joi.string()).required(),
});

module.exports = { authSchema, authSchema2, authSchema3 };
