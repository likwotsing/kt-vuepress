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

## Git常见问题

1. `.git/index`文件错误

    ```bash
    # 错误现象
    $ git status
    error: bad signature 0x00000000
    fatal: index file corrupt
    ```

    **解决办法**：

    - 删除旧的索引文件，它路径在项目的.git/index，Linux 执行`rm -f .git/index`，Windows 执行`del .git\index`

    - 通过reset命令重建索引：git reset

    > 有可能还没解决，会出现如下问题：
    >
    > ```bash
    > $ git log
    > fatal: your current branch appears to be broken
    > ```
    >
    > **解决办法**：把远程仓库（github）上的最新最新commit的id，复制到.git\refs\heads\xxx（当前分支）中，如果还有错误，根据提示，把commit的id复制到.git\refs\remotes\origin\xxx（当前分支）中。

2. 每次push都需要输入用户名密码

    **原因**：添加远程仓库时使用了https的方式

    ```bash
    # 查看目前关联的远程仓库
    git remote -v
    ```

    **解决办法**：修改成ssh的方式即可

    ```bash
    # 重新设置远程仓库的关联方式
    git remote rm origin
    git remote add origin git@github.com:username/repository.git
    git push -u origin master
    ```

    ## Git小知识

    ### 上传大文件

    当文件超过100M时，可以使用Git LFS
    
    ### git fetch和git pull
    
    git fetch只能更新远程仓库的代码(./git/refs/remotes)，本地仓库的代码还未更新(./git/refs/heads)
    
    ...待更新

