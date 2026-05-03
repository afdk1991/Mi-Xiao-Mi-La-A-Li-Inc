import * as mysql2 from 'mysql2/promise';

export const databaseConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'user_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export async function queryDatabase(sql: string, values?: any[]) {
  const pool = mysql2.createPool(databaseConfig);
  const [results] = await pool.execute(sql, values);
  await pool.end();
  return results;
}
