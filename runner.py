import os
import time
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

# 必须先加载项目settings配置
os.environ.setdefault('SCRAPY_SETTINGS_MODULE', 'auto_news.settings')
process = CrawlerProcess(get_project_settings())

# process.crawl("rmw_hb")
process.crawl("rmw_hb_detail")

# 执行所有 spider
# for spider_name in process.spider_loader.list():
#     process.crawl(spider_name)

while True:
    process.start()  # the script will block here until all crawling jobs are finished
    print('wait 5min')
    time.sleep(5 * 60)
