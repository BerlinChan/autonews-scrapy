import subprocess
from apscheduler.schedulers.blocking import BlockingScheduler
import logging
import os

logging.basicConfig()


def spider_rmw():
    (list_out, detail_out) = (
        subprocess.check_output("scrapy crawl rmw_hb", shell=True),
        subprocess.check_output("scrapy crawl rmw_hb_detail", shell=True)
    )
    out_text = list_out.decode('utf-8') + detail_out.decode('utf-8')
    print(out_text)


if __name__ == '__main__':
    sched = BlockingScheduler()
    sched.add_job(spider_rmw, 'interval', minutes=5)

    print('Press Ctrl+{0} to exit'.format('Break' if os.name == 'nt' else 'C'))

    try:
        sched.start()
    except (KeyboardInterrupt, SystemExit):
        pass