const express = require('express');
const createError = require('http-errors');
const {
    getTotalArticleCount,
    getAllArticles,
    getArticleById,
    createArticle,
    deleteArticle,
} = require('../Models/Article.model_mysqldb');

const router = express.Router();

router.get('/allArticles', async (req, res, next) => {
    try {
        const articles = await getAllArticles();
        const totalArticleCount = await getTotalArticleCount();

        res.status(200).json({
            status: 'Success',
            message: 'All articles retrieved successfully',
            totalArticleCount,
            articles,
        });
    } catch (error) {
        next(createError(404, 'Article not found'));
    }
});

router.get('/getArticle', async (req, res, next) => {
    try {
        const articleId = parseInt(req.query.articleId);
        const article = await getArticleById(articleId);

        res.status(200).json({
            status: 'Success',
            message: 'Article retrieved successfully',
            article,
        });
    } catch (error) {
        next(createError(404, 'Article not found'));
    }
});

router.post('/addArticle', async (req, res, next) => {
    try {
        const articleData = req.body;
        const { article } = await createArticle(articleData);
        res.status(201).json({
            status: 'Success',
            message: 'Article created successfully',
            article,
        });
    } catch (error) {
        if (error.isJoi === true) {
            return next(createError(422, 'Validation Error'));
        }
        next(createError(404, 'Article not found'));
    }
});

router.delete('/deleteArticle', async (req, res, next) => {
    try {
        const articleId = parseInt(req.query.articleId);
        const { deletedArticleId } = await deleteArticle(articleId);

        res.status(200).json({
            status: 'Success',
            message: 'Article deleted successfully',
            deletedArticleId,
        });
    } catch (error) {
        next(createError(404, 'Article not found'));
    }
});

module.exports = router;
