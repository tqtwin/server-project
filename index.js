const app = require('./src/app');
const PORT = process.env.PORT || 8081;
require('dotenv').config();
// Swagger setup
const setupSwagger = require('./swagger');
setupSwagger(app);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
