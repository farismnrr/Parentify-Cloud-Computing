const express = require('express');
const createError = require('http-errors');
const {
    createFoodSchema,
    deleteFoodSchema,
} = require('../helpers/validation_schema');
const {
    getFoods,
    getClassification,
    createFood,
    createClassification,
    deleteFood,
    deleteClassification,
} = require('../Models/Food.model_mysqldb');

const router = express.Router();

router.get('/allFoods', async (req, res, next) => {
    try {
        const foods = await getFoods();

        // Calculate totalResults
        const totalResults = foods.length;

        const response = {
            status: 'Success',
            message: 'Foods retrieved successfully',
            totalResults,
            articles: foods,
        };

        res.status(200).json(response);
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
        } = await createFoodSchema.validateAsync(req.body);
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

router.delete('/deleteFood', async (req, res, next) => {
    try {
        const name = req.query.food_name;
        console.log('Received Request Body:', name);

        const existingFood = await getFoods();
        const nameExist = existingFood.some((foods) => foods.name === name);

        if (!nameExist) {
            throw createError.Conflict(`${name} is not registered`);
        }

        const { foods } = await deleteFood(name);

        const classification = await deleteClassification({
            name,
        });

        res.status(201).send({ foods, classification });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
});

module.exports = router;
