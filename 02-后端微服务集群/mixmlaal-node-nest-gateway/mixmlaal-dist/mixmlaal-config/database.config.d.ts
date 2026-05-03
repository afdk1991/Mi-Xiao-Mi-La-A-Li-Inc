import * as mysql2 from 'mysql2/promise';
export declare const databaseConfig: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    waitForConnections: boolean;
    connectionLimit: number;
    queueLimit: number;
};
export declare function queryDatabase(sql: string, values?: any[]): Promise<mysql2.QueryResult>;
