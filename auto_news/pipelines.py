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
from jpype import *


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
            if self.db['list'].find_one({'url': item.get('url')}) is not None:
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
        if isinstance(item, NewsListItem):
            print(item['origin_name'] + ': ' + item['title'])
            # 发送到websocket服务
            request('POST', self.http_server + 'listItem_added', data=json.dumps(dict(item)))
        return item


# nlp处理，提取关键字
class NLPKeywordPipeline(object):
    def process_item(self, item, spider):
        if isinstance(item, NewsListItem):
            return item
        elif isinstance(item, NewsDetailItem):
            temp_item = item
            content_text = BeautifulSoup(item['content']).get_text()
            temp_item['keywords'] = SnowNLP(content_text).keywords(5)
            return temp_item


# nlp处理，新闻分类
class NLPClassifyPipeline(object):
    def __init__(self):
        startJVM(getDefaultJVMPath(),
                 "-Djava.class.path="
                 "./lib/THUCTC_java_v1/liblinear-1.8.jar:"
                 "./lib/THUCTC_java_v1/THULAC_java_v1.jar:"
                 "./lib/THUCTC_java_v1/",
                 "-Xms1g", "-Xmx1g")  # 启动JVM，Linux需替换分号;为冒号:
        BasicTextClassifier = JClass('org.thunlp.text.classifiers.BasicTextClassifier')

        # 新建分类器对象
        self.classifier = BasicTextClassifier()
        # 设置分类种类，并读取模型
        self.defaultArguments = "-l ./lib/THUCTC_java_v1/news_model/"
        self.classifier.Init(self.defaultArguments.split(" "))
        self.classifier.runAsBigramChineseTextClassifier()

    def open_spider(self, spider):
        pass

    def close_spider(self, spider):
        shutdownJVM()

    def process_item(self, item, spider):
        if isinstance(item, NewsListItem):
            return item
        elif isinstance(item, NewsDetailItem):
            content_text = BeautifulSoup(item['content']).get_text()
            top_n = 2  # 保留最有可能的2个结果
            result = self.classifier.classifyText(content_text, top_n)

            temp_item = item
            temp_item['nlpClassify'] = []
            for i in range(top_n):
                # 分类名称，以及概率值。
                temp_item['nlpClassify'].append({
                    'name': self.classifier.getCategoryName(result[i].label),
                    'prob': result[i].prob,
                })

            return temp_item


# nlp处理，情感评价
class NLPSentimentPipeline(object):
    def process_item(self, item, spider):
        if isinstance(item, NewsListItem):
            return item
        elif isinstance(item, NewsDetailItem):
            content_text = BeautifulSoup(item['content']).get_text()

            temp_item = item
            temp_item['nlpSentiment'] = SnowNLP(content_text).sentiments

            return temp_item


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
