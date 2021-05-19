import subprocess
from apscheduler.schedulers.blocking import BlockingScheduler
import logging
import os

logging.basicConfig()


def spider_rmw():
    out_text = subprocess.check_output("scrapy crawl rmw_hb_detail", shell=True).decode('utf-8') + \
               subprocess.check_output("scrapy crawl txdcw", shell=True).decode('utf-8') + \
               subprocess.check_output("scrapy crawl hbrb", shell=True).decode('utf-8') + \
               subprocess.check_output("scrapy crawl cjrb", shell=True).decode('utf-8')
    print(out_text)


if __name__ == '__main__':
    sched = BlockingScheduler()
    sched.add_job(spider_rmw, 'interval', minutes=5)

    print('Press Ctrl+{0} to exit'.format('Break' if os.name == 'nt' else 'C'))

    try:
        sched.start()
    except (KeyboardInterrupt, SystemExit):
        pass
