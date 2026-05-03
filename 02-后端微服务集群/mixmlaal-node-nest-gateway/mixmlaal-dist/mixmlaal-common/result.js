"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
class Result {
    static success(data = null, msg = "操作成功") {
        return { code: 200, msg, data };
    }
    static fail(msg = "服务异常", code = 500) {
        return { code, msg, data: null };
    }
}
exports.Result = Result;
//# sourceMappingURL=result.js.map