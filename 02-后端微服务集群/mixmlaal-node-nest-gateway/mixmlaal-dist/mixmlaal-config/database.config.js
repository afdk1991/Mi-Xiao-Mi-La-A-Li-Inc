"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
exports.queryDatabase = queryDatabase;
const mysql2 = require("mysql2/promise");
exports.databaseConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'user_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};
async function queryDatabase(sql, values) {
    const pool = mysql2.createPool(exports.databaseConfig);
    const [results] = await pool.execute(sql, values);
    await pool.end();
    return results;
}
//# sourceMappingURL=database.config.js.map