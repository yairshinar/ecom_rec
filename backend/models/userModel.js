const pool = require('../db/postgres');

const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    return result.rows[0];
};

module.exports = { getUserById };
