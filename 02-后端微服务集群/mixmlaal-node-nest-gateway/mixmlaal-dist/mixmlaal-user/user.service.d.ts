export declare class UserService {
    private users;
    findAll(): Promise<{
        id: number;
        account: string;
        nickname: string;
    }[]>;
    findById(id: number): Promise<{
        id: number;
        account: string;
        nickname: string;
    }>;
    register(data: {
        account: string;
        password: string;
        nickname?: string;
    }): Promise<boolean>;
    login(account: string, password: string): Promise<string>;
}
