# Auto News 新闻监控系统爬虫

## 安装
- install pyenv: `brew pyenv`
- install virtualenv:
- install python: `$ pyenv install 3.6.1`
- install requirements: `$ pip install -r requirements.txt`
- create new virtualenv: `$ pyenv virtualenv 3.6.1 playground`
- activate a virtualenv: `$ pyenv activate playground`

## 运行
- 运行调度： `python scrapy_scheduler.py`
- 运行所有爬虫： `python run_all_spiders.py`

## 常用命令
- 新建爬虫：`scrapy gensipder <new_spider> <url>` 

## 使用scrapyd
- 命令`scrapyd`启动 scrapyd，默认在[localhost:6800](http://localhost:6800/)建立监控界面

## Build docker image
- lib目录下放置[jdk-6u45-linux-x64.bin](http://www.oracle.com/technetwork/java/javase/downloads/java-archive-downloads-javase6-419409.html#jre-6u45-oth-JPR)
- lib目录下放置[hanlp model]()
- lib目录下放置[THUCTC model]()
- docker build -t autonews-scrapy .
