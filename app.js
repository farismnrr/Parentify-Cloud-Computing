const express = require('express');
const foodRoutes = require('./food-api/food-routes');

const app = express();
const port = 8080;

app.use('/', foodRoutes);

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
