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
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
