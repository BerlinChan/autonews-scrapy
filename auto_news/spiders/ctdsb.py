# -*- coding: utf-8 -*-
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from auto_news.items import NewsDetailItem
from bson.objectid import ObjectId
import arrow
from datetime import datetime
import re


class CtdsbSpider(CrawlSpider):
    """
        楚天都市报
        http://ctdsb.cnhubei.com/cache/paper_ctdsb.aspx
    """
    name = "ctdsb"
    origin = {'key': 'ctdsb', 'name': '楚天都市报'}
    allowed_domains = ["ctdsb.cnhubei.com"]
    todayDateStr = arrow.utcnow().format('YYYYMMDD')
    start_urls = [
        'http://ctdsb.cnhubei.com/HTML/ctdsb/' + todayDateStr + '/',
    ]

    rules = [
        Rule(LinkExtractor(allow='\.html$',
                           restrict_css='td+ td td td .info2 , td+ td td td .info1'),
             callback='parse_detail_item'),
        Rule(LinkExtractor(allow='open\(\'\w+\.html', tags='td', attrs='onclick'),
             process_links='process_next_page_links', follow=True),
    ]
    custom_settings = {
        'CONCURRENT_REQUESTS': 1,
        'ITEM_PIPELINES': {
            'auto_news.pipelines.DropEmptyDetailItemPipeline': 100,
            'auto_news.pipelines.RemoveDuplicatePipeline': 200,
            'auto_news.pipelines.SocketOnNewsAdded': 300,
            'auto_news.pipelines.NLPKeywordPipeline': 350,
            'auto_news.pipelines.NLPClassifyPipeline': 360,
            'auto_news.pipelines.NLPSentimentPipeline': 370,
            'auto_news.pipelines.InsertItemPipeline': 400,
        }
    }

    def parse_detail_item(self, response):
        if response.css('title::text').extract_first() == '楚天都市报':
            item = None
        else:
            item = NewsDetailItem()
            item["_id"] = ObjectId()
            item["title"] = response.css('#Table17 tr:nth-child(2) td::text').extract_first()
            item["subTitle"] = ''.join(
                response.css('#Table17 tr:nth-child(1) td::text,'
                             ' #Table17 tr:nth-child(3) td::text').extract())
            item["category"] = ''.join(
                response.css('#Table16 tr:nth-child(1) td:nth-child(1)::text ,'
                             ' #Table16 tr:nth-child(1) td:nth-child(3)::text').extract())
            item["url"] = response.url
            item["content"] = re.sub(r"src=\"/(.+\.jpg)\"", "src=\"" + response.urljoin(r"../../../\1") + "\"",
                                     ''.join(response.css('#copytext img').extract())) + \
                              response.css('#copytext font').extract_first()
            item["articleSource"] = ''
            item["authorName"] = ''
            item["editorName"] = ''
            item["date"] = arrow.get(re.search(r'/(\d{8})/', response.url).group(1) + ' 08:00',
                                     'YYYYMMDD ZZ').isoformat()
            item["crawledDate"] = datetime.utcnow().isoformat()
            item["origin_name"] = self.origin['name']
            item["origin_key"] = self.origin['key']

        return item

    def process_next_page_links(self, links):
        for link in links:
            link.url = re.search(r'(http.+\d{8}/)window', link.url).group(1) + \
                       re.search(r'open\(\'(\w+\.html)', link.url).group(1)

        return links
