from scrapy.crawler import CrawlerProcess
from auto_news.spiders.rmw_hb import RmwHbSpider
from auto_news.spiders.rmw_hb_detail import RmwHbDetailSpider
from scrapy.utils.project import get_project_settings
from apscheduler.schedulers.twisted import TwistedScheduler
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR


def my_listener(event):
    if event.exception:
        print('The job crashed :(')
    else:
        print('The job worked :)')


process = CrawlerProcess(get_project_settings())
sched = TwistedScheduler()
sched.add_listener(my_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR)
sched.add_job(process.crawl, 'interval', args=[RmwHbSpider], seconds=1, max_instances=1)
sched.add_job(process.crawl, 'interval', args=[RmwHbDetailSpider], seconds=1, max_instances=1)
sched.start()
process.start(False)  # Do not stop reactor after spider closes
