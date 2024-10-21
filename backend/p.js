const { Client } = require('pg');

const client = new Client({
  host: 'your_db_host',
  user: 'your_db_user',
  password: 'your_db_password',
  database: 'your_db_name',
  port: 5432, // default PostgreSQL port
  ssl: false  // Set to true if you're using SSL
});

client.connect()
  .then(() => console.log('Connected successfully'))
  .catch(e => console.log(e))
  .finally(() => client.end());