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
      url: 'http://localhost:8081',
      description: 'Máy chủ phát triển',
    },
  ],
  tags: [
    {
      name: 'Users',
      description: 'Các endpoint liên quan đến người dùng',
    },
    {
      name: 'Posts',
      description: 'Các endpoint liên quan đến bài viết',
    },
    {
      name: 'Products',
      description: 'Các endpoint liên quan đến sản phẩm',
    },
    {
      name: 'Categories',
      description: 'Các endpoint liên quan đến danh mục',
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./src/routers/**/*.js'], // Đường dẫn đến các file API
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
