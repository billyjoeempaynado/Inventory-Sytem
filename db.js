const Pool = require('pg').Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Inventory_System",
  password: "test",
  port: 5432,
});

module.exports = pool;