'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [
      {
        name: 'Product 1',
        description: 'Description for product 1',
        price: 100.00,
        category: 'Category 1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Product 2',
        description: 'Description for product 2',
        price: 150.00,
        category: 'Category 2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Product 3',
        description: 'Description for product 3',
        price: 200.00,
        category: 'Category 1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Product 4',
        description: 'Description for product 4',
        price: 250.00,
        category: 'Category 3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Product 5',
        description: 'Description for product 5',
        price: 300.00,
        category: 'Category 2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Product 6',
        description: 'Description for product 6',
        price: 120.00,
        category: 'Category 1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Product 7',
        description: 'Description for product 7',
        price: 180.00,
        category: 'Category 3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Product 8',
        description: 'Description for product 8',
        price: 220.00,
        category: 'Category 2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Product 9',
        description: 'Description for product 9',
        price: 140.00,
        category: 'Category 1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Product 10',
        description: 'Description for product 10',
        price: 160.00,
        category: 'Category 3',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
