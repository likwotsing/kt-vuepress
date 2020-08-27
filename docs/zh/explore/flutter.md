# Flutter

## 安装

[参考文档](https://flutterchina.club/setup-windows/)

1. 获取flutter的SDK，从官网clone最新项目到本地，如：clone到C盘根目，本教程的版本是`1.22.0-2.0.pre.93`

   > 最好**不要**放到系统里需要权限的文件，如: Program Files

   ```bash
   git clone git@github.com:flutter/flutter.git
   ```

2. 添加环境变量，因为国内访问flutter可能会有限制

   此电脑 -> 右键属性 -> 高级系统设置 -> 环境变量 -> 在**系统变量**里**新建**

   | 变量名                   | 变量值                        |
   | ------------------------ | ----------------------------- |
   | PUB_HOSTED_URL           | https://pub.flutter-io.cn     |
   | FLUTTER_STORAGE_BASE_URL | https://storage.flutter-io.cn |

   另外，在环境变量`Path`里添加一个值：`C:\flutter\bin`，此处的值就是第1步里存放的flutter的路径，根据需要酌情修改。

3. 在`C:\flutter\`里找到`flutter_console.bat`，双击运行，会看到` WELCOME to the Flutter Console.`等信息，在cmd里输入`flutter doctor`后，会开始安装一些依赖，稍等一会，会出现一个以` Welcome to Flutter!`为标题的一个白边的框，说明安装依赖完成。

4. 下载并安装[android studio](https://developer.android.google.cn/studio)，本教程的版本是`v4.0.1`

5. 在andriod studio安装插件：File -> Settings -> Plugins，搜索`flutter`，并安装，会提示依赖`Dart`，会一起安装。

6. 新建Flutter项目：File -> New -> New Flutter Project，会需要配置Flutter SDK path，就是第1步里的flutter存放路径，如: `C:\flutter`

7. 新建模拟器：Tooles -> AVD Manager

   - 如果列表已经有了Device，就点击Actions列里的小三角(Launch this AVD in the emulator)
   - 如果列表里没有Device，就`Create Virtual Device`，默认选中的是`Phone`，点击`Next`，默认选中的是`Recommended`，点击`Release Name`列里的`Download`,下载完成后，点击`Next`，输入`AVD Name`，点击`Finish`。然后点击Actions列里的小三角。

   > - 点击小三角后，会在屏幕上出现一个手机模拟器
   >
   > - 如果模拟器是黑屏的，是不是不小心点击了模拟器右侧的Power？

8. 在第7步新建的flutter项目里，点击工具栏上的绿色三角按钮(shift+F10)，运行后，就会在第7步里的模拟器里显示`main.dart`的内容。

   > main.dart的路径： \lib\main.dart，试着修改第29行的title，会看到模拟器里的内容会跟着变化。

