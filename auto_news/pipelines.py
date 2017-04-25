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


# 从 mongodb 集的 url field 过滤重复
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
            if self.db['list'].find_one({'url': item.get('url').lower()}) is not None:
                raise DropItem("Already exist url: %s" % item.get('url'))
            else:
                return item
        elif isinstance(item, NewsDetailItem):
            return item


# 请求 websocket 服务，通知客户端更新
class SocketOnNewsAdded(object):
    def __init__(self, http_server):
        self.http_server = http_server

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            http_server=crawler.settings.get('HTTP_SERVER'),
        )

    def process_item(self, item, spider):
        # 发送到websocket服务
        send_title = ('' if item['title'] is None else item['title']) + \
                     ('' if item['subTitle'] is None else item['subTitle'])
        print(item['origin_name'] + ': ' + send_title)
        if isinstance(item, NewsListItem):
            request('POST', self.http_server + 'listItem_added', data=json.dumps(dict(item)))
        elif isinstance(item, NewsDetailItem):
            send_item = {
                '_id': item['_id'],
                'url': item['url'],
                'title': item['title'],
                'subTitle': item['subTitle'],
                'date': item['date'],
                'origin_key': item['origin_key'],
            }
            request('POST', self.http_server + 'listItem_added', data=json.dumps(dict(send_item)))
        return item


# nlp处理，提取关键字
class NLPKeywordPipeline(object):
    def process_item(self, item, spider):
        if isinstance(item, NewsListItem):
            pass
        elif isinstance(item, NewsDetailItem):
            item['keywords'] = []
            content_text = BeautifulSoup(item['content'], "lxml").get_text()
            if content_text is not None:
                temp_keywords = spider.HanLP.extractKeyword(content_text, 5)
                for i in range(len(temp_keywords)):
                    item['keywords'].append(temp_keywords[i])

        return item


# nlp处理，新闻分类
class NLPClassifyPipeline(object):
    def process_item(self, item, spider):
        if isinstance(item, NewsListItem):
            pass
        elif isinstance(item, NewsDetailItem):
            item['nlpClassify'] = []
            top_n = 2  # 保留最有可能的2个结果
            content_text = BeautifulSoup(item['content'], "lxml").get_text()
            if content_text is not None:
                result = spider.classifier.classifyText(content_text, top_n)
                for i in range(len(result)):
                    # 分类名称，以及概率值。
                    item['nlpClassify'].append({
                        'name': spider.classifier.getCategoryName(result[i].label),
                        'prob': result[i].prob,
                    })

        return item


# nlp处理，情感评价
class NLPSentimentPipeline(object):
    def process_item(self, item, spider):
        if isinstance(item, NewsListItem):
            pass
        elif isinstance(item, NewsDetailItem):
            content_text = BeautifulSoup(item['content'], "lxml").get_text()
            if content_text is not None:
                item['nlpSentiment'] = SnowNLP(content_text).sentiments

        return item


# 插入记录到数据库
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


# drop empty detail item 用于当页面返回错误时
class DropEmptyDetailItemPipeline(object):
    def process_item(self, item, spider):
        if item is None:
            raise DropItem("Drop empty detail item: %s" % item.get('url'))
        else:
            return item
