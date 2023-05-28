// //https://ysupup.oss-cn-hangzhou.aliyuncs.com/gold.png

const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');

// 配置OSS客户端
const client = new OSS({
  region: 'oss-cn-hangzhou', // 您的 OSS 区域，例如 'oss-cn-shanghai'
  accessKeyId: 'LTAI5tPHDBC1gifUnFpU5Wkj', // 您的访问密钥 ID
  accessKeySecret: 'vedlp2CVEQPHmL6agy5JOlL56tdZMV', // 您的访问密钥 secret
  bucket: 'ysupup' // 您的 OSS 存储桶名称
});

// 递归遍历目录并上传文件
async function uploadDirectory(directory, prefix = '') {
  try {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        const result = await client.put(`${prefix}${file}`, filePath);
        console.log(`上传成功: ${result.url}`);
      } else if (stats.isDirectory()) {
        await uploadDirectory(filePath, `${prefix}${file}/`);
      }
    }
  } catch (error) {
    console.error(`上传失败: ${error.message}`);
  }
}

// 开始上传
const localDirectory = '../dist';
uploadDirectory(localDirectory);