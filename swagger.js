const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API với Swagger',
    version: '1.0.0',
    description: 'Ứng dụng API CRUD đơn giản được tài liệu hóa với Swagger',
  },
  servers: [
    {
      url: 'http://localhost:8083',
      description: 'Máy chủ phát triển',
    },
  ],
  tags: [
    { name: 'Users', description: 'Các endpoint liên quan đến người dùng' },
    { name: 'Reviews', description: 'Các endpoint liên quan đến đánh giá' },
    { name: 'Products', description: 'Các endpoint liên quan đến sản phẩm' },
    { name: 'Categories', description: 'Các endpoint liên quan đến danh mục' },
    { name: 'Suppliers', description: 'Các endpoint liên quan đến nhà cung cấp' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./src/routers/**/*.js', './src/models/**/*.js'], // Đường dẫn đến các file API
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
