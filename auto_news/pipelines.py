# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html

import scrapy
import json
from auto_news.items import NewsDetailItem, NewsListItem


class AutoNewsPipeline(object):
    def process_item(self, item, spider):
        return item


class SocketOnNewsAdded(object):
    def __init__(self, http_server):
        # self.assignItemProcessor(itemclass=NewsListItem, processor=self.storeList)
        # self.assignItemProcessor(itemclass=NewsDetailItem, processor=self.storeDetail)
        self.http_server = http_server

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            http_server=crawler.settings.get('HTTP_SERVER'),
        )

    def process_item(self, item, spider):
        scrapy.Request('http://localhost:3090/', method='POST', body=json.dumps(item))
        print('on news item added', item)
        return item

    def storeList(item, spider):
        pass  # make some things with Headers item here

    def storeDetail(item, spider):
        pass  # make some things with Body item here
