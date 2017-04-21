import os
from twisted.internet import reactor, defer
from scrapy.crawler import CrawlerRunner
from scrapy.utils.project import get_project_settings
from scrapy.utils.log import configure_logging

# 必须先加载项目settings配置
os.environ.setdefault('scrapy_settings_module', 'auto_news.settings')
configure_logging(get_project_settings())
runner = CrawlerRunner(get_project_settings())


@defer.inlineCallbacks
def crawl():
    # 执行所有 spider
    # for spider_name in runner.spider_loader.list():
    #     yield runner.crawl(spider_name)

    # yield runner.crawl('rmw_hb')
    # yield runner.crawl('rmw_hb_detail')
    # yield runner.crawl('hbrb')
    yield runner.crawl('cjrb')
    reactor.stop()


crawl()
reactor.run()  # the script will block here until the last crawl call is finished
