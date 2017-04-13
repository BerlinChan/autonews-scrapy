from apscheduler.schedulers.blocking import BlockingScheduler
from auto_news.run_all_spider import process


def job():
    print('Run all spiders')
    process.start()


# BlockingScheduler
scheduler = BlockingScheduler()
scheduler.add_job(job, 'interval', minutes=5)
scheduler.start()
