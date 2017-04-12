# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html

import pymongo
from bson.objectid import ObjectId
from requests import request
import json
from datetime import datetime
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
        # 发送到websocket服务
        request('POST', self.http_server + 'listItem_added', data=json.dumps(item))
        return item

    def storeList(item, spider):
        pass  # make some things with Headers item here

    def storeDetail(item, spider):
        pass  # make some things with Body item here


class InsertListItemPipeline(object):
    collection_name = 'list'

    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler): return cls(
        mongo_uri=crawler.settings.get('MONGO_URI'),
        mongo_db=crawler.settings.get('MONGO_DATABASE')
    )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        tempItem = item
        tempItem['_id'] = ObjectId(item.get('_id'))
        tempItem['date'] = datetime.fromtimestamp(item.get('date'))
        self.db[self.collection_name].insert(tempItem)
        return item
