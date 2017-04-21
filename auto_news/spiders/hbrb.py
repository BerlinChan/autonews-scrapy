# -*- coding: utf-8 -*-
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from auto_news.items import NewsDetailItem
from bson.objectid import ObjectId
import arrow
from datetime import datetime
import re


class HbrbSpider(CrawlSpider):
    """
        湖北日报
        http://hbrb.cnhubei.com/cache/paper_hbrb.aspx

        楚天都市报
        http://ctdsb.cnhubei.com/cache/paper_ctdsb.aspx
        
        楚天金报
        http://ctjb.cnhubei.com/cache/paper_ctjb.aspx
        
        楚天快报
        http://ctdsbxy.cnhubei.com/cache/paper_ctdsbxy.aspx

        楚天时报
        http://ctdsbxy.cnhubei.com/cache/paper_ctdsbxy.aspx

        三峡晚报
        http://sxwb.cnhubei.com/cache/paper_sxwb.aspx

    """
    name = "hbrb"
    allowed_domains = ["cnhubei.com"]
    todayDateStr = arrow.utcnow().format('YYYYMMDD')
    start_urls = [
        'http://ctdsb.cnhubei.com/HTML/ctdsb/' + todayDateStr + '/',
        'http://ctjb.cnhubei.com/HTML/ctjb/' + todayDateStr + '/',
        'http://ctdsbxy.cnhubei.com/HTML/ctdsbxy/' + todayDateStr + '/',
        'http://epaper.cnhubei.com/HTML/ctsb/' + todayDateStr + '/',
        'http://hbrb.cnhubei.com/HTML/hbrb/' + todayDateStr + '/',
        'http://sxwb.cnhubei.com/html/sxwb/' + todayDateStr + '/',
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
        'SPIDER_MIDDLEWARES': {
            'auto_news.middlewares.EmptyCookiesMiddleware': 500,
            'auto_news.middlewares.StartJVMMiddleware': 600,
        },
        'ITEM_PIPELINES': {
            # 'auto_news.pipelines.DropEmptyDetailItemPipeline': 100,
            'auto_news.pipelines.RemoveDuplicatePipeline': 200,
            'auto_news.pipelines.SocketOnNewsAdded': 300,
            'auto_news.pipelines.NLPKeywordPipeline': 350,
            'auto_news.pipelines.NLPClassifyPipeline': 360,
            'auto_news.pipelines.NLPSentimentPipeline': 370,
            'auto_news.pipelines.InsertItemPipeline': 400,
        }
    }

    def parse_detail_item(self, response):
        item = NewsDetailItem()
        item["_id"] = ObjectId()
        item["title"] = response.css('#Table17 tr:nth-child(2) td::text').extract_first()
        item["subTitle"] = ''.join(
            response.css('#Table17 tr:nth-child(1) td::text,'
                         ' #Table17 tr:nth-child(3) td::text').extract())
        item["category"] = ''.join(
            response.css('#Table16 tr:nth-child(1) td:nth-child(1)::text ,'
                         ' #Table16 tr:nth-child(1) td:nth-child(3)::text').extract())
        item["url"] = response.url.lower()

        all_img = response.css('#copytext img').extract()
        all_img = list(
            map(lambda i: re.sub(r"src=\"/(.+\.jpg)\"", "src=\"" + response.urljoin(r"../../../\1") + "\"", i),
                all_img))
        item["content"] = ''.join(all_img) + response.css('#copytext font').extract_first()
        item["articleSource"] = ''
        item["authorName"] = ''
        item["editorName"] = ''
        item["date"] = arrow.get(re.search(r'/(\d{8})/', response.url).group(1) + ' 08:00',
                                 'YYYYMMDD ZZ').isoformat()
        item["crawledDate"] = datetime.utcnow().isoformat()

        second_level_domain = re.search(r'http://(\w+)\.cnhubei.com/', response.url.lower()).group(1)
        if second_level_domain == 'ctdsb':
            item["origin_key"] = 'ctdsb'
            item["origin_name"] = '楚天都市报'
        elif second_level_domain == 'ctjb':
            item["origin_key"] = 'ctjb'
            item["origin_name"] = '楚天金报'
        elif second_level_domain == 'ctdsbxy':
            item["origin_key"] = 'ctkb'
            item["origin_name"] = '楚天快报'
        elif second_level_domain == 'epaper':
            item["origin_key"] = 'ctsb'
            item["origin_name"] = '楚天时报'
        elif second_level_domain == 'hbrb':
            item["origin_key"] = 'hbrb'
            item["origin_name"] = '湖北日报'
        elif second_level_domain == 'sxwb':
            item["origin_key"] = 'sxwb'
            item["origin_name"] = '三峡晚报'

        return item

    def process_next_page_links(self, links):
        for link in links:
            link.url = re.search(r'(http.+\d{8}/)window', link.url).group(1) + \
                       re.search(r'open\(\'(\w+\.html)', link.url).group(1)

        return links
