# Electron 桌面客户端 - Windows / Mac

使用Electron开发的跨平台桌面应用，支持Windows和Mac系统。

## 项目结构

```
electron-desktop/
├── main/              # 主进程
│   └── main.ts
├── renderer/         # 渲染进程 (可以嵌入Vue/React前端)
├── package.json
└── electron-builder.json
```

## 技术栈

- Electron 30.x
- TypeScript
- Vue 3 / React 18 (可复用现有前端代码)
- Electron Builder (打包工具)

## 功能模块

- 商品浏览
- 购物车
- 订单管理
- 系统托盘
- 消息通知
- 本地存储
