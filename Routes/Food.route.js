const express = require('express');
const createError = require('http-errors');
const { authSchema3 } = require('../helpers/validation_schema');
const {
    getFoods,
    getClassification,
    createFood,
    createClassification,
} = require('../Models/User.model_mysqldb');

const router = express.Router();

router.get('/allFoods', async (req, res, next) => {
    try {
        const foods = await getFoods();
        res.status(200).json({ foods });
    } catch (error) {
        next(error);
    }
});

router.get('/getClasification', async (req, res, next) => {
    try {
        const foodName = req.query.food_name;
        const result = await getClassification(foodName);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.post('/addFood', async (req, res, next) => {
    try {
        const {
            img,
            name,
            type,
            description,
            nutrition,
            information,
            status,
            texture,
        } = await authSchema3.validateAsync(req.body);
        console.log('Received Request Body:', name);

        const existingFood = await getFoods();
        const nameExist = existingFood.some((foods) => foods.name === name);

        if (nameExist) {
            throw createError.Conflict(`${name} is already registered`);
        }

        const { foods } = await createFood(
            img,
            name,
            type,
            description,
            nutrition,
        );

        const classification = await createClassification({
            name,
            information,
            status,
            texture,
        });

        res.status(201).send({ foods, classification });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
});

module.exports = router;
