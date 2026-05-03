// 与Java/Python接口格式完全一致
export class Result {
  static success(data: any = null, msg = "操作成功") {
    return { code: 200, msg, data };
  }

  static fail(msg = "服务异常", code = 500) {
    return { code, msg, data: null };
  }
}
