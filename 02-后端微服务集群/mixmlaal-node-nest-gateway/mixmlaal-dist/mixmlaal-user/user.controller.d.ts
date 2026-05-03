import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<{
        code: number;
        msg: string;
        data: any;
    }>;
    findOne(id: string): Promise<{
        code: number;
        msg: string;
        data: any;
    }>;
    register(body: {
        account: string;
        password: string;
        nickname?: string;
    }): Promise<{
        code: number;
        msg: string;
        data: any;
    }>;
    login(body: {
        account: string;
        password: string;
    }): Promise<{
        code: number;
        msg: string;
        data: any;
    }>;
}
