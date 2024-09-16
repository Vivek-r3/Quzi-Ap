//dbOps.js  
const { query } = require('./db');

// Function to insert values into a given table
const insertIntoTable = async (tableName, data) => {
  const columns = Object.keys(data).join(', ');
  const values = Object.values(data);
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

  const text = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *`;
  
  try {
    const res = await query(text, values);
    return res.rows[0];
  } catch (err) {
    console.error('Error executing insert query', err);
    throw err;
  }
};
const updateTable = async (tableName, data, condition) => {
    const setClause = Object.keys(data)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ');
    const values = Object.values(data);
  
    const conditionClause = Object.keys(condition)
      .map((key, i) => `${key} = $${i + values.length + 1}`)
      .join(' AND ');
    const conditionValues = Object.values(condition);
  
    const text = `UPDATE ${tableName} SET ${setClause} WHERE ${conditionClause} RETURNING *`;
    try {
      const res = await query(text, [...values, ...conditionValues]);
      return res.rows[0];
    } catch (err) {
      console.error('Error executing update query', err);
      throw err;
    }
  };
  const deleteFromTable = async (tableName, condition) => {
    const conditionClause = Object.keys(condition)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(' AND ');
    const conditionValues = Object.values(condition);
  
    const text = `DELETE FROM ${tableName} WHERE ${conditionClause}`;
    try {
      await query(text, conditionValues);
      return { success: true };
    } catch (err) {
      console.error('Error executing delete query', err);
      throw err;
    }
  };

  const selectFromTable = async (tableName, columns = '*', condition = {}) => {
    const conditionClause = Object.keys(condition)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(' AND ');
    const conditionValues = Object.values(condition);
  
    const text = `SELECT ${columns} FROM ${tableName}${
      conditionClause ? ` WHERE ${conditionClause}` : ''
    }`;
  
    try {
      const res = await query(text, conditionValues);
      return res.rows;
    } catch (err) {
      console.error('Error executing select query', err);
      throw err;
    }
  };
 
module.exports = {
    insertIntoTable,
    updateTable,
    deleteFromTable,
    selectFromTable,
};