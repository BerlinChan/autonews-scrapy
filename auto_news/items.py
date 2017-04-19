# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class AutoNewsItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass


# 新闻列表item
class NewsListItem(scrapy.Item):
    _id = scrapy.Field()  # list document 唯一id
    title = scrapy.Field()  # 文章标题
    url = scrapy.Field()  # 文章链接
    date = scrapy.Field()  # 文章发布日期
    origin_name = scrapy.Field()  # 文章来源、出处
    origin_key = scrapy.Field()  # 指向 origin 表中对应的 key


# 新闻详情item
class NewsDetailItem(scrapy.Item):
    _id = scrapy.Field()  # 文章唯一 document id，与对应 list id 相同
    title = scrapy.Field()  # 文章标题
    subTitle = scrapy.Field()  # 文章副标题
    category = scrapy.Field()  # 文章分类、子栏目、子版面、子频道
    url = scrapy.Field()  # 文章地址
    content = scrapy.Field()  # 正文内容
    articleSource = scrapy.Field()  # 文章来源
    authorName = scrapy.Field()  # 作者名
    editorName = scrapy.Field()  # 编辑姓名
    date = scrapy.Field()  # 文章发布日期时间戳
    crawledDate = scrapy.Field()  # 抓取日期时间戳
    origin_name = scrapy.Field()  # 抓取来源名
    origin_key = scrapy.Field()  # 抓取来源key，指向 origin collection 中对应的 document id
    keywords = scrapy.Field()  # 文章关键词
    nlpClassify = scrapy.Field()  # 文章 nlp 处理分类
    nlpSentiment = scrapy.Field()  # 文章 nlp 情感识别
