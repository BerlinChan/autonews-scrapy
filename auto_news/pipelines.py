# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html

import pymongo
from bson.objectid import ObjectId
from requests import request
import json
from auto_news.items import NewsDetailItem, NewsListItem
from scrapy.exceptions import DropItem
from dateutil import parser
from snownlp import SnowNLP
from bs4 import BeautifulSoup


class RemoveDuplicatePipeline(object):
    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get('MONGO_URI'),
            mongo_db=crawler.settings.get('MONGO_DATABASE')
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        if isinstance(item, NewsListItem):
            if self.db['list'].find_one({'url': item.get('url')}) is not None:
                raise DropItem("Already exist url: %s" % item.get('url'))
            else:
                return item
        elif isinstance(item, NewsDetailItem):
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
        if isinstance(item, NewsListItem):
            print(item['origin_name'] + ': ' + item['title'])
            # 发送到websocket服务
            request('POST', self.http_server + 'listItem_added', data=json.dumps(dict(item)))
        return item


class AddTagsPipeline(object):
    def process_item(self, item, spider):
        if isinstance(item, NewsListItem):
            return item
        elif isinstance(item, NewsDetailItem):
            temp_item = item
            content_text = BeautifulSoup(item['content']).get_text()
            temp_item['keywords'] = SnowNLP(content_text).keywords(5)
            return temp_item


class ClassifyNewsPipeline(object):
    def process_item(self, item, spider):
        if isinstance(item, NewsListItem):
            return item
        elif isinstance(item, NewsDetailItem):
            temp_item = item
            content_text = BeautifulSoup(item['content']).get_text()

            # temp_classify = re.match(r'Classifying.+:(.+)\s', out_text.decode('utf-8')).group(1).strip()
            temp_item['nlpClassify'] = ''
            return temp_item


class InsertItemPipeline(object):
    collection_name = 'list'

    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri=crawler.settings.get('MONGO_URI'),
            mongo_db=crawler.settings.get('MONGO_DATABASE')
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        if isinstance(item, NewsListItem):
            temp_item = item
            temp_item['_id'] = ObjectId(item.get('_id'))
            temp_item['date'] = parser.parse(item.get('date'))
            self.db['list'].insert(dict(temp_item))
            return item
        elif isinstance(item, NewsDetailItem):
            temp_item = item
            temp_item['_id'] = ObjectId(item.get('_id'))
            temp_item['date'] = parser.parse(item.get('date'))
            temp_item['crawledDate'] = parser.parse(item.get('crawledDate'))
            self.db['detail'].insert(dict(temp_item))
            return item
