# -*- coding: utf-8 -*-

# Define here the models for your spider middleware
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/spider-middleware.html

from scrapy import signals
from jpype import *

# 全局 scrapy 启动时 startJVM
startJVM(getDefaultJVMPath(),
         "-Djava.class.path="
         "./auto_news/lib/hanlp-1.3.2/hanlp-1.3.2.jar:"
         "./auto_news/lib/hanlp-1.3.2/:"
         "./auto_news/lib/THUCTC_java_v1/liblinear-1.8.jar:"
         "./auto_news/lib/THUCTC_java_v1/THULAC_java_v1.jar:"
         "./auto_news/lib/THUCTC_java_v1/",
         "-Xms1g", "-Xmx1g")  # 启动JVM，Linux需替换分号;为冒号:
HanLP = JClass('com.hankcs.hanlp.HanLP')

BasicTextClassifier = JClass('org.thunlp.text.classifiers.BasicTextClassifier')
# 新建分类器对象
classifier = BasicTextClassifier()
# 设置分类种类，并读取模型
defaultArguments = "-l ./auto_news/lib/THUCTC_java_v1/news_model/"
classifier.Init(defaultArguments.split(" "))
classifier.runAsBigramChineseTextClassifier()


class AutoNewsSpiderMiddleware(object):
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the spider middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_spider_input(response, spider):
        # Called for each response that goes through the spider
        # middleware and into the spider.

        # Should return None or raise an exception.
        return None

    def process_spider_output(response, result, spider):
        # Called with the results returned from the Spider, after
        # it has processed the response.

        # Must return an iterable of Request, dict or Item objects.
        for i in result:
            yield i

    def process_spider_exception(response, exception, spider):
        # Called when a spider or process_spider_input() method
        # (from other spider middleware) raises an exception.

        # Should return either None or an iterable of Response, dict
        # or Item objects.
        pass

    def process_start_requests(start_requests, spider):
        # Called with the start requests of the spider, and works
        # similarly to the process_spider_output() method, except
        # that it doesn’t have a response associated.

        # Must return only requests (not items).
        for r in start_requests:
            yield r

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)


class StartJVMMiddleware(object):
    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        crawler.signals.connect(s.spider_closed, signal=signals.spider_closed)
        return s

    def spider_opened(self, spider):
        print('Spider opened: %s' % spider.name)

        # 传递 java 对象实例给 spiders
        spider.HanLP = HanLP
        spider.classifier = classifier

    def spider_closed(self, spider):
        print('Crawl complete: ' + spider.name)


class EmptyCookiesMiddleware(object):
    """ 清空Ccookies """

    def process_request(self, request, spider):
        request.cookies = {}
