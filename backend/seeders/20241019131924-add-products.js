'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [
      {
        product_id: 1,  // Seeded ID
        name: 'Wireless Earbuds',
        description: 'High-quality sound and noise cancellation.',
        price: 99.99,
        category: 'Electronics',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date()
      },
      {
        product_id: 2,  // Seeded ID
        name: 'Smartwatch',
        description: 'Stay connected with this sleek smartwatch.',
        price: 199.99,
        category: 'Wearables',
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date()
      },
      {
        product_id: 3,  // Seeded ID
        name: 'Bluetooth Speaker',
        description: 'Portable and waterproof with exceptional sound.',
        price: 79.99,
        category: 'Audio',
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date()
      },
      {
        product_id: 4,  // Seeded ID
        name: 'Gaming Mouse',
        description: 'Precision and performance for gamers.',
        price: 49.99,
        category: 'Gaming',
        createdAt: new Date('2024-04-20'),
        updatedAt: new Date()
      },
      {
        product_id: 5,  // Seeded ID
        name: '4K Monitor',
        description: 'Stunning visuals for gaming and productivity.',
        price: 299.99,
        category: 'Computers',
        createdAt: new Date('2024-05-25'),
        updatedAt: new Date()
      },
      {
        product_id: 6,  // Seeded ID
        name: 'Wireless Charger',
        description: 'Fast and convenient charging solution.',
        price: 39.99,
        category: 'Accessories',
        createdAt: new Date('2024-06-30'),
        updatedAt: new Date()
      },
      {
        product_id: 7,  // Seeded ID
        name: 'Fitness Tracker',
        description: 'Monitor your activity and health metrics.',
        price: 59.99,
        category: 'Health',
        createdAt: new Date('2024-07-15'),
        updatedAt: new Date()
      },
      {
        product_id: 8,  // Seeded ID
        name: 'Laptop Stand',
        description: 'Ergonomic design for comfortable working.',
        price: 29.99,
        category: 'Office',
        createdAt: new Date('2024-08-10'),
        updatedAt: new Date()
      },
      {
        product_id: 9,  // Seeded ID
        name: 'Noise-Cancelling Headphones',
        description: 'Immerse yourself in sound without distractions.',
        price: 149.99,
        category: 'Audio',
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date()
      },
      {
        product_id: 10, // Seeded ID
        name: 'Portable SSD',
        description: 'Fast and reliable storage on the go.',
        price: 99.99,
        category: 'Storage',
        createdAt: new Date('2024-09-20'),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
