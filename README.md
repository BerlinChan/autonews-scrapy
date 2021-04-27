# Autonews

新闻源监控系统(Autonews System)，是一个实时监控、收录新闻更新的工具，主要功能如下：

- 准实时监控新闻更新并汇总反应到界面，免除人工值守，反复刷新监控
- 汇总分散的新闻，提供一处界面总览当日新闻全局，供网络新闻编辑和新闻关注者查阅、筛选、处理
- 查询往期内容，为新闻专题、汇总专题、旧闻查阅提供数据参考
- (开发中的功能……)

目前监控对象如下：
- 腾讯·大楚网新闻，包括: 要闻/宜昌/襄阳/黄石/十堰/孝感/荆门/荆州/黄冈/恩施/随州/潜江/仙桃
- 三峡晚报
- 楚天都市报
- 湖北日报
- 楚天金报
- 楚天快报
- 楚天时报
- 长江日报
- 武汉晚报
- 武汉晨报
- 人民网-湖北频道
- 黄石日报（待添加）添加中……

## Develop

## 运行
- run mongoDB server: `mongod --config /usr/local/etc/mongod.conf`
- init db: `node utils/dbInit.js`
- 运行HTTP服务：`node server/index.js`
- 运行爬虫：参照项目 autonews-scrapy
- 编译客户端：`npm run deploy:prod`
- 客户端 dev 环境：运行`npm start`，打开 [localhost:3091/autonews/](http://localhost:3091/autonews/)
- 打开客户端： [localhost:3090/autonews/](http://localhost:3090/autonews/)

## Release Note
请见[About](http://www.berlinchan.com/autonews/about)

## 常用命令
- 备份mongodb：`mongodump -h 127.0.0.1:27017 -d auto-news -o C:\data\backup\`
- 恢复mongodb：`mongorestore -h 127.0.0.1:27017 -d auto-news C:\data\backup\auto-news`
- 构建docker image：`docker build -t autonews-api .`
- 运行 API docker：`docker run -d --name autonews-api-container --restart always -p 3090:3090 autonews-api`
- 运行 scrapy docker(爬虫项目)：`docker run -d --name autonews-scarpy-container --restart always --link autonews-api autonews-scrapy`
- stop all Docker container: `docker stop $(docker ps -a -q)`
- remove all Docker container: `docker rm $(docker ps -a -q)`
- 使用 [qydev.com](http://qydev.com) 的内网穿透： `ngrok -config=ngrok.cfg -subdomain autonews 3090`
