const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',        // Replace with your PostgreSQL user
  host: 'localhost',       // Database host
  database: 'postgres', // Replace with your DB name
  password: 'new_password',    // Your DB password
  port: 5432               // PostgreSQL port
});

const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
};