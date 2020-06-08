# kt-vuepress
vuepress

<details>
  <summary>部署到Github Pages</summary>

1. config.js里主要配置如下：
	
	```js
themeConfig: {
	  repo: 'likwotsing/kt-vuepress',
    docsDir: 'docs',
	  lastUpdated: '上次更新',
	  editLinks: true,
	  editLinkText: '在GitHub上编辑此页'
	}
	```
	
2. 根目录下添加`deploy.sh`文件

    ```sh
    #!/usr/bin/env sh
      
    # 确保脚本抛出遇到的错误
    set -e
    
    # 生成静态文件
    npm run docs:build
    
    # 进入生成的文件夹
    cd docs/.vuepress/dist
    
    # 如果是发布到自定义域名
    # echo 'www.example.com' > CNAME
    
    git init
    git add -A
    git commit -m 'deploy'
    
    # 如果发布到 https://<USERNAME>.github.io
    # git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master
    
    # 如果发布到 https://<USERNAME>.github.io/<REPO>
    git push -f git@github.com:likwotsing/kt-vuepress.git master:gh-pages
    
    cd -
    ```

3. package.json里添加script

   ```js
   "deploy": "bash deploy.sh"
   ```

4. 在**git bash**里执行命令

   ```bash
   npm run deploy
   ```

5. 访问链接

   ```js
   https://likwotsing.github.io/kt-vuepress/
   ```

</details>



