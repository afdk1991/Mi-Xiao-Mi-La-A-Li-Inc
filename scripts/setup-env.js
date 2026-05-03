const fs = require('fs');
const path = require('path');

const envFiles = [
  {
    source: path.join(__dirname, '../07-公共资源/mixmlaal-configs/.env.example'),
    targets: [
      path.join(__dirname, '../.env'),
      path.join(__dirname, '../02-后端微服务集群/mixmlaal-node-api/.env'),
    ],
  },
];

console.log('正在设置环境变量文件...\n');

envFiles.forEach(({ source, targets }) => {
  if (fs.existsSync(source)) {
    const content = fs.readFileSync(source, 'utf8');
    targets.forEach(target => {
      if (!fs.existsSync(target)) {
        fs.writeFileSync(target, content);
        console.log(`创建: ${target}`);
      } else {
        console.log(`已存在: ${target} (跳过)`);
      }
    });
  } else {
    console.warn(`源文件不存在: ${source}`);
  }
});

console.log('\n环境变量设置完成！');
console.log('请根据需要编辑 .env 文件中的配置');
