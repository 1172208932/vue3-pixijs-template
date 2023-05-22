// 导入阿里云 OSS SDK
const OSS = require('ali-oss');

const path = require('path');
const fs = require('fs');

// 配置 OSS 客户端
const client = new OSS({
  region: 'oss-cn-hangzhou', // 您的 OSS 区域，例如 'oss-cn-shanghai'
  accessKeyId: 'LTAI5tPHDBC1gifUnFpU5Wkj', // 您的访问密钥 ID
  accessKeySecret: 'vedlp2CVEQPHmL6agy5JOlL56tdZMV', // 您的访问密钥 secret
  bucket: 'ysupup' // 您的 OSS 存储桶名称
});

// // 定义一个用于上传图片的异步函数
// async function uploadImage(filePath, objectName) {
//   try {
//     // 使用 put 方法上传图片
//     const result = await client.put(objectName, filePath);
//     console.log('图片上传成功:', result.url);
//   } catch (error) {
//     console.error('图片上传失败:', error);
//   }
// }

// // 调用 uploadImage 函数上传图片
// uploadImage('path/to/your/image.jpg', 'your-image-object-name.jpg');


async function uploadFolder(folderPath, ossPath) {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      const ossFilePath = path.join(ossPath, file);
      await client.put(ossFilePath, filePath);
      console.log(`Uploaded ${filePath} to OSS as ${ossFilePath}`);
    } else if (stats.isDirectory()) {
      const subFolder = path.join(ossPath, file);
      await client.putBucket(subFolder);
      await uploadFolder(filePath, subFolder);
    }
  }
}

//https://ysupup.oss-cn-hangzhou.aliyuncs.com/gold.png

uploadFolder('../public/static', '')
  .then(() => console.log('Upload completed'))
  .catch(err => console.error(err));