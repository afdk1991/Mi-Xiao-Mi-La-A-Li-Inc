"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyMiddleware = void 0;
const common_1 = require("@nestjs/common");
const http_proxy_middleware_1 = require("http-proxy-middleware");
let ProxyMiddleware = class ProxyMiddleware {
    use(req, res, next) {
        if (req.path.startsWith('/api/java')) {
            (0, http_proxy_middleware_1.createProxyMiddleware)({
                target: process.env.JAVA_GATEWAY_URL,
                changeOrigin: true,
                pathRewrite: { '^/api/java': '' },
            })(req, res, next);
        }
        else if (req.path.startsWith('/api/python')) {
            (0, http_proxy_middleware_1.createProxyMiddleware)({
                target: process.env.PYTHON_SERVICE_URL,
                changeOrigin: true,
                pathRewrite: { '^/api/python': '' },
            })(req, res, next);
        }
        else {
            next();
        }
    }
};
exports.ProxyMiddleware = ProxyMiddleware;
exports.ProxyMiddleware = ProxyMiddleware = __decorate([
    (0, common_1.Injectable)()
], ProxyMiddleware);
//# sourceMappingURL=proxy.middleware.js.map