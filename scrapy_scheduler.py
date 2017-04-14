import os
from apscheduler.schedulers.twisted import TwistedScheduler
from twisted.internet import reactor
from run_all_spiders import RunAllSpiders

from twisted.internet import defer
from scrapy.crawler import CrawlerRunner
from scrapy.utils.project import get_project_settings
from scrapy.utils.log import configure_logging


def job():
    print('Run all spiders')
    # 必须先加载项目settings配置
    os.environ.setdefault('SCRAPY_SETTINGS_MODULE', 'auto_news.settings')
    configure_logging({'LOG_FORMAT': '%(levelname)s: %(message)s'})
    runner = CrawlerRunner(get_project_settings())

    @defer.inlineCallbacks
    def crawl():
        yield runner.crawl('rmw_hb')
        yield runner.crawl('rmw_hb_detail')
        reactor.stop()

    crawl()


if __name__ == '__main__':
    scheduler = TwistedScheduler()
    scheduler.add_job(job, 'interval', seconds=10)
    scheduler.start()
    print('Press Ctrl+{0} to exit'.format('Break' if os.name == 'nt' else 'C'))

    # Execution will block here until Ctrl+C (Ctrl+Break on Windows) is pressed.
    try:
        reactor.run()
    except (KeyboardInterrupt, SystemExit):
        pass
