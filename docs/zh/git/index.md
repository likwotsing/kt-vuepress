# Git

## 配置Git

> 在一台电脑上配置gitee、github

1. [下载](https://git-scm.com/downloads)并安装

2. git bash 里

   ```bash
   # 配置用户名和邮箱
   git config --global user.name "yourname"
   git config --global user.email "mail@gmail.com"
   ```

   ```bash
   # 生成github、gitee秘钥
   ssh-keygen -t rsa -C "mail@gmail.com" -f ~/.ssh/id_rsa_github
   ssh-keygen -t rsa -C "mail@gmail.com" -f ~/.ssh/id_rsa_gitee
   ```

3. 配置config

   > - Windows系统一般在`C:\Users\admin\.ssh`

   创建config文件：`touch config`，配置内容如下：

   ```bash
   # gitee
   Host gitee.com
   HostName gitee.com
   IdentityFile ~/.ssh/id_rsa_gitee
   
   # github
   Host github.com
   HostName github.com
   IdentityFile ~/.ssh/id_rsa_github
   ```

4. 复制相应的公钥到gitee和github里

5. 验证配置

   ```bash
   ssh -T git@gitee.com
   ssh -T git@github.com
   ```

   