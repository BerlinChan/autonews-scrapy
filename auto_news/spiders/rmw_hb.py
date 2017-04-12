# -*- coding: utf-8 -*-
import json
import scrapy
from scrapy.spiders import Rule
from scrapy.linkextractors import LinkExtractor
from scrapy.loader import ItemLoader
from auto_news.items import NewsListItem, NewsDetailItem
from bson.objectid import ObjectId
from bson import json_util
import arrow


class RmwHbSpider(scrapy.Spider):
    name = "rmw_hb"
    allowed_domains = ["hb.people.com.cn"]
    start_urls = ['http://hb.people.com.cn/GB/337099/index1.html']
    rules = [
        # Rule(LinkExtractor(allow=("/subject/\d+$")), callback='parse_list'),
        # Rule(LinkExtractor(allow=("/tag/[^/]+$",)), follow=True),
    ]
    custom_settings = {
        'ITEM_PIPELINES': {
            'auto_news.pipelines.RemoveDuplicatePipeline': 200,
            'auto_news.pipelines.SocketOnNewsAdded': 300,
            'auto_news.pipelines.InsertListItemPipeline': 400,
        }
    }

    def parse(self, response):
        for listItem in response.css('.d2_2 li'):
            yield {
                '_id': str(ObjectId()),
                'origin_key': 'rmw_hb',
                'origin_name': '人民网-湖北频道',
                'url': response.urljoin(listItem.css('a::attr(href)').extract_first()),
                'title': listItem.css('a::text').extract_first(),
                'date': arrow.get(listItem.css('i::text').extract_first()[2:-2] + ' +08:00',
                                  'YYYY年MM月DD日 HH:mm ZZ').timestamp,
            }

        # next page
        last_btn_text = response.css('.d2tu_3 a:last-child::text').extract_first()
        if last_btn_text == "下一页":
            next_page = response.css('.d2tu_3 a:last-child::attr(href)').extract_first()
            if next_page is not None:
                next_page = response.urljoin(next_page)
                yield scrapy.Request(next_page, callback=self.parse)
