# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapy.loader import ItemLoader
from auto_news.items import NewsListItem, NewsDetailItem
from bson.objectid import ObjectId
import arrow
from datetime import datetime


class RmwHbDetailSpider(CrawlSpider):
    name = "rmw_hb_detail"
    allowed_domains = ["hb.people.com.cn"]
    start_urls = [
        'http://hb.people.com.cn/GB/337099/index1.html',
        'http://hb.people.com.cn/GB/194146/194147/index.html',
    ]
    rules = [
        Rule(LinkExtractor(allow='/n2/', restrict_css='.d2_2 li'),
             callback='parse_item', process_links='process_links'),
        Rule(LinkExtractor(allow='index\d+\.html$', restrict_css='.d2tu_3 a:last-child'),
             process_links='process_next_page_links', follow=True),
    ]
    custom_settings = {
        'ITEM_PIPELINES': {
            'auto_news.pipelines.RemoveDetailDuplicatePipeline': 200,
            # 'auto_news.pipelines.SocketOnNewsAdded': 300,
            'auto_news.pipelines.InsertDetailItemPipeline': 400,
        }
    }

    def parse_item(self, response):
        item = NewsDetailItem(
            _id=ObjectId(),
            title=response.css('h1::text').extract_first(),
            subTitle='',
            category=response.css('.clink+ .clink::text').extract(),
            tags='',
            url=response.url,
            content=response.css('.box_con p').extract_first(),
            authorName=response.css('.author::text').extract_first(),
            editorName=response.css('.edit::text').extract_first(),
            date=arrow.get(response.css('.box01 .fl::text').extract_first()[:-5] + ' 08:00',
                           'YYYY年MM月DD日HH:mm ZZ').isoformat(),
            crawledDate=datetime.utcnow().isoformat(),
            origin_name='人民网-湖北频道',
            origin_key='rmw_hb',
        )
        return item

    def process_links(self, links):

        return links

    def process_next_page_links(self, links):
        for link in links:
            if link.text == '下一页':
                return links
            else:
                return []
