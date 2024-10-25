'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [
      {
        name: 'Product 1',
        description: 'A unique item that blends functionality with style.',
        price: 100.00,
        category: 'Electronics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 2',
        description: 'An innovative gadget for your daily needs.',
        price: 150.00,
        category: 'Home Appliances',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 3',
        description: 'A stylish accessory to complement your outfit.',
        price: 80.00,
        category: 'Fashion',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 4',
        description: 'An essential tool for every household.',
        price: 120.00,
        category: 'Tools',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 5',
        description: 'A game-changer in personal care.',
        price: 60.00,
        category: 'Beauty',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 6',
        description: 'Advanced technology for health monitoring.',
        price: 200.00,
        category: 'Health',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 7',
        description: 'A premium quality for the discerning buyer.',
        price: 250.00,
        category: 'Luxury',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 8',
        description: 'A delightful treat for your taste buds.',
        price: 30.00,
        category: 'Food',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 9',
        description: 'A multifunctional device for modern living.',
        price: 90.00,
        category: 'Electronics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Product 10',
        description: 'An eco-friendly choice for a sustainable future.',
        price: 70.00,
        category: 'Eco-Friendly',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
