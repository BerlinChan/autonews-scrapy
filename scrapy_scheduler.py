import subprocess
from apscheduler.schedulers.blocking import BlockingScheduler
import logging
import os

logging.basicConfig()


def spider_comm():
    (a, b) = (
        subprocess.check_output("scrapy crawl rmw_hb", shell=True),
        subprocess.check_output("scrapy crawl rmw_hb_detail", shell=True)
    )
    out_text = a.decode('utf-8') + b.decode('utf-8')
    print(out_text)


if __name__ == '__main__':
    sched = BlockingScheduler()
    sched.add_job(spider_comm, 'interval', minutes=5)
    print('Press Ctrl+{0} to exit'.format('Break' if os.name == 'nt' else 'C'))

    try:
        sched.start()
    except (KeyboardInterrupt, SystemExit):
        pass
