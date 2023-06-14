
const OSS = require('ali-oss');

// 配置OSS客户端
const client = new OSS({

});

// 递归清空指定目录
async function clearOssDirectoryRecursively(directory) {
  try {
    // 列出目录中的所有文件和子目录
    let result = await client.list({
      prefix: directory,
      delimiter: '/'
    });

    // 删除目录中的所有文件
    for (const file of result.objects) {
      await client.delete(file.name);
      console.log(`Deleted: ${file.name}`);
    }

    // 递归删除子目录
    for (const subdir of result.prefixes) {
      await clearOssDirectoryRecursively(subdir);
    }

    console.log(`Directory ${directory} cleared successfully.`);
  } catch (error) {
    console.error(`Error clearing directory ${directory}:`, error);
  }
}

// 调用函数，清空指定目录及其子目录
clearOssDirectoryRecursively('running-dev/');

