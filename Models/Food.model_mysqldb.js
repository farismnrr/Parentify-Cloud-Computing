const connection = require('../helpers/init_mysqldb');

async function getFoods() {
    const [rows] = await connection.query(`
        SELECT
            foods.img,
            foods.name,
            foods.type,
            foods.description,
            foods.nutrition,
            CONCAT('[', GROUP_CONCAT('"', classification.information, '"'), ']') AS information,
            CONCAT('[', GROUP_CONCAT('"', classification.status, '"'), ']') AS status,
            CONCAT('[', GROUP_CONCAT('"', classification.texture, '"'), ']') AS texture
        FROM
            foods
        INNER JOIN
            classification ON foods.name = classification.name
        GROUP BY
            foods.img, foods.name, foods.type, foods.description, foods.nutrition
        LIMIT 0, 25
    `);

    // Transform the rows into the desired JSON format
    const formattedFoods = rows.map((row) => ({
        img: row.img,
        name: row.name,
        type: row.type,
        description: row.description,
        nutrition: row.nutrition,
        information: JSON.parse(row.information),
        status: JSON.parse(row.status),
        texture: JSON.parse(row.texture),
    }));

    return formattedFoods;
}

async function getClassification(foodName) {
    try {
        // Retrieve the desired information for the specified food item
        const [rows] = await connection.query(
            `
            SELECT
            foods.img,
            foods.name,
            foods.type,
            foods.description,
            foods.nutrition,
            CONCAT('[', GROUP_CONCAT('"', classification.information, '"'), ']') AS information,
            CONCAT('[', GROUP_CONCAT('"', classification.status, '"'), ']') AS status,
            CONCAT('[', GROUP_CONCAT('"', classification.texture, '"'), ']') AS texture
        FROM
            foods
        INNER JOIN
            classification ON foods.name = classification.name
        WHERE
            foods.name = ?
        GROUP BY
            foods.img, foods.name, foods.type, foods.description, foods.nutrition
        LIMIT 0, 25;        
        `,
            [foodName],
        );

        if (rows.length === 0) {
            throw { status: 404, message: 'Food not found' };
        }

        return rows;
    } catch (error) {
        throw error;
    }
}

async function createFood(img, name, type, description, nutrition) {
    const [result] = await connection.query(
        'INSERT INTO foods (img, name, type, description, nutrition) VALUES (?, ?, ?, ?, ?)',
        [img, name, type, description, nutrition],
    );
    const id = result.insertId;

    return {
        foods: {
            id,
            img,
            name,
            type,
            description,
            nutrition,
        }, // Fix here: Destructure from result, not user
    };
}

async function createClassification(data) {
    const insertQuery =
        'INSERT INTO classification (name, information, status, texture) VALUES (?, ?, ?, ?)';

    const maxArrayLength = Math.max(
        data.information.length,
        data.status.length,
        data.texture.length,
    );

    for (let i = 0; i < maxArrayLength; i++) {
        const name = data.name || null;
        const information =
            data.information && data.information[i]
                ? data.information[i]
                : null;
        const status = data.status && data.status[i] ? data.status[i] : null;
        const texture =
            data.texture && data.texture[i] ? data.texture[i] : null;

        await connection.execute(insertQuery, [
            name,
            information,
            status,
            texture,
        ]);
    }

    return data;
}

async function deleteFood(name) {
    const [result] = await connection.query(
        'DELETE FROM foods WHERE name = ?',
        [name],
    );
    const id = result.insertId;

    return {
        foods: { id, name },
    };
}

async function deleteClassification(data) {
    const deleteQuery = 'DELETE FROM classification WHERE name = ?';

    const namesToDelete = Array.isArray(data.name) ? data.name : [data.name];

    const deletedNames = [];

    for (const name of namesToDelete) {
        await connection.execute(deleteQuery, [name]);
        deletedNames.push(name);
    }

    return { deletedNames };
}

module.exports = {
    getFoods,
    getClassification,
    createFood,
    createClassification,
    deleteFood,
    deleteClassification,
};
