export declare class Result {
    static success(data?: any, msg?: string): {
        code: number;
        msg: string;
        data: any;
    };
    static fail(msg?: string, code?: number): {
        code: number;
        msg: string;
        data: any;
    };
}
