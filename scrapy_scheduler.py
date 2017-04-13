import os
from apscheduler.schedulers.twisted import TwistedScheduler
from twisted.internet import reactor
from run_all_spiders import run_all_spiders


def job():
    print('Run all spiders')
    run_all_spiders()


if __name__ == '__main__':
    scheduler = TwistedScheduler()
    scheduler.add_job(job, 'interval', minutes=3)
    scheduler.start()
    print('Press Ctrl+{0} to exit'.format('Break' if os.name == 'nt' else 'C'))

    # Execution will block here until Ctrl+C (Ctrl+Break on Windows) is pressed.
    try:
        reactor.run()
    except (KeyboardInterrupt, SystemExit):
        pass
