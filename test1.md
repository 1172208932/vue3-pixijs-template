这个错误是由于 Jenkins 的 CSRF 保护机制导致的。当你尝试在 Script Console 中执行脚本时，Jenkins 需要一个有效的 crumb（防跨站请求伪造令牌）来验证请求。要解决这个问题，你可以尝试以下方法：

方法 1：禁用 CSRF 保护（不推荐）

这个方法不推荐，因为它会降低 Jenkins 的安全性。但是，如果你只是在本地或安全环境中进行测试，可以考虑临时禁用 CSRF 保护。

1. 登录到 Jenkins。
2. 点击 "Manage Jenkins"（管理 Jenkins）。
3. 点击 "Configure Global Security"（配置全局安全）。
4. 在 "CSRF Protection"（CSRF 保护）部分，取消选中 "Prevent Cross Site Request Forgery exploits"（防止跨站请求伪造攻击）。
5. 点击 "Save"（保存）。

方法 2：使用 Jenkins CLI

你可以使用 Jenkins CLI 来执行 Groovy 脚本。首先，你需要下载 Jenkins CLI。可以在 Jenkins 的 "Manage Jenkins"（管理 Jenkins）> "Jenkins CLI"（Jenkins 命令行）页面找到下载链接。

然后，将 Groovy 脚本保存到一个文件中，例如 `install_gitlab_runner.groovy`。接下来，使用 Jenkins CLI 执行脚本：

```bash
java -jar jenkins-cli.jar -s http://common.ysupup.com:8001/ -auth xrql45:QWer@1234 groovy install_gitlab_runner.groovy
```

请确保替换 `http://your-jenkins-url/`、`username` 和 `password` 为你的实际值。

这样，你应该可以在 Jenkins 中成功执行 Groovy 脚本，而不会遇到 CSRF 保护相关的错误。

java -jar jenkins-cli.jar -s http://common.ysupup.com:8001/ -auth xrql45:QWer@1234 groovy =< install_gitlab_runner.groovy
java -jar jenkins-cli.jar -s http://common.ysupup.com:8001/ -auth xrql45:QWer@1234 groovy "$(cat install_gitlab_runner.groovy)"
