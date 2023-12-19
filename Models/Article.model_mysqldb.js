const connection = require('../helpers/init_mysqldb');

async function getAllArticles() {
    const [rows] = await connection.query('SELECT * FROM articles');
    return rows;
}

async function getArticleById(articleId) {
    const [rows] = await connection.query(
        'SELECT * FROM articles WHERE articleId = ?',
        [articleId],
    );

    if (rows.length === 0) {
        throw { status: 404, message: 'Article not found' };
    }

    return rows[0];
}

async function getTotalArticleCount() {
    const [result] = await connection.query(
        'SELECT COUNT(*) as totalCount FROM articles',
    );
    return result[0].totalCount;
}

async function createArticle(articleData) {
    const {
        articleName,
        author,
        title,
        description,
        url,
        urlToImage,
        publishedAt,
        content,
    } = articleData;

    const [result] = await connection.query(
        'INSERT INTO articles (articleName, author, title, description, url, urlToImage, publishedAt, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
            articleName,
            author,
            title,
            description,
            url,
            urlToImage,
            publishedAt,
            content,
        ],
    );
    const articleId = result.insertId;

    return {
        article: {
            articleId,
            articleName,
            author,
            title,
            description,
            url,
            urlToImage,
            publishedAt,
            content,
        },
    };
}

async function deleteArticle(articleId) {
    const [result] = await connection.query(
        'DELETE FROM articles WHERE articleId = ?',
        [articleId],
    );

    if (result.affectedRows === 0) {
        throw { status: 404, message: 'Article not found' };
    }

    return { deletedArticleId: articleId };
}

module.exports = {
    getTotalArticleCount,
    getAllArticles,
    getArticleById,
    createArticle,
    deleteArticle,
};
