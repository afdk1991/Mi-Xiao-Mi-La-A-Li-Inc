"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    const port = process.env.SERVER_PORT || 8002;
    await app.listen(port);
    console.log(`NestJS网关服务运行在: http://localhost:${port}`);
    console.log(`WebSocket端点: ws://localhost:${port}/im`);
}
bootstrap();
//# sourceMappingURL=main.js.map