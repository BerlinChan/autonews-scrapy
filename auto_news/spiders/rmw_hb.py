# -*- coding: utf-8 -*-
import json
import scrapy
from scrapy.spiders import Rule
from scrapy.linkextractors import LinkExtractor
from scrapy.loader import ItemLoader
from auto_news.items import NewsListItem, NewsDetailItem


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
            'auto_news.pipelines.SocketOnNewsAdded': 300,
        }
    }

    def parse(self, response):
        for listItem in response.css('.d2_2 li'):
            yield {
                '_id': '_id',
                'origin_key': 'rmw_hb',
                'url': listItem.css('a::attr(href)').extract_first(),
                'title': listItem.css('a::text').extract_first(),
                'date': listItem.css('i::text').extract_first(),
            }

        # next page
        last_btn_text = response.css('.d2tu_3 a:last-child::text').extract_first()
        if last_btn_text == "下一页":
            next_page = response.css('.d2tu_3 a:last-child::attr(href)').extract_first()
            if next_page is not None:
                next_page = response.urljoin(next_page)
                yield scrapy.Request(next_page, callback=self.parse)
