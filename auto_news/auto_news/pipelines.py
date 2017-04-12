# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html

import scrapy
import json


class AutoNewsPipeline(object):
    def process_item(self, item, spider):
        return item


class SocketOnNewsAdded(object):
    def __init__(self, http_server):
        self.http_server = http_server

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            http_server=crawler.settings.get('HTTP_SERVER'),
        )

    def process_item(self, item, spider):
        scrapy.Request('http://localhost:3090/', method='POST', body=json.dumps(item))
        return item
