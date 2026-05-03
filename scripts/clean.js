const fs = require('fs');
const path = require('path');

const dirsToClean = [
  path.join(__dirname, '../01-前端集群/mixmlaal-frontend/node_modules'),
  path.join(__dirname, '../01-前端集群/mixmlaal-web-vue-pc/node_modules'),
  path.join(__dirname, '../02-后端微服务集群/mixmlaal-node-api/node_modules'),
];

console.log('正在清理项目...\n');

dirsToClean.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`删除: ${dir}`);
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

console.log('\n清理完成！');
