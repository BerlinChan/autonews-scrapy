# -*- coding: utf-8 -*-
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from auto_news.items import NewsListItem, NewsDetailItem
from bson.objectid import ObjectId
import arrow
from datetime import datetime
import re


class RmwHbDetailSpider(CrawlSpider):
    name = "rmw_hb_detail"
    origin = {'key': 'rmw_hb', 'name': '人民网-湖北频道'}
    allowed_domains = ["hb.people.com.cn"]
    start_urls = [
        'http://hb.people.com.cn/GB/337099/index1.html',
        'http://hb.people.com.cn/GB/194146/194147/index.html',
    ]
    rules = [
        Rule(LinkExtractor(allow='/n2/\d{4}/\d{4}/c', restrict_css='.d2_2 li'),
             callback='parse_detail_item'),
        Rule(LinkExtractor(allow='index\d+\.html$', restrict_css='.d2tu_3 a:last-child'),
             process_links='process_next_page_links', follow=True),
    ]
    custom_settings = {
        'ITEM_PIPELINES': {
            'auto_news.pipelines.RemoveDuplicatePipeline': 200,
            'auto_news.pipelines.SocketOnNewsAdded': 300,
            'auto_news.pipelines.NLPKeywordPipeline': 350,
            'auto_news.pipelines.NLPClassifyPipeline': 360,
            'auto_news.pipelines.NLPSentimentPipeline': 370,
            'auto_news.pipelines.InsertItemPipeline': 400,
        }
    }

    def closed(self, reason):
        print('Crawl complete: ' + self.origin['name'] + ' detail')

    def parse_detail_item(self, response):
        item = NewsDetailItem()
        if response.css('.pic_content').extract_first() is not None:
            # 大图模版，如 http://hb.people.com.cn/n2/2017/0413/c337099-30022706.html
            item["_id"] = ObjectId()
            item["title"] = response.css('h1::text').extract_first()
            item["subTitle"] = ''
            item["category"] = response.css('.clink~ .clink+ .clink::text').extract_first()
            item["keywords"] = ''
            item["url"] = response.url
            item["content"] = re.sub(r"/(NMediaFile/.+\.jpg)", response.urljoin(r"../../../\1"),
                                     response.css('#picG img').extract_first()) + \
                              ''.join(response.css('.content p').extract())
            item["articleSource"] = response.css('#picG .fr a::text').extract_first() if response.css(
                '#picG .fr a::text').extract_first() else response.css('.page_c a::text').extract_first()
            item["authorName"] = ''
            item["editorName"] = response.css('#p_editor::text').extract_first()
            item["date"] = arrow.get(response.css('#picG .fr::text').extract()[1].strip() + ' 08:00'
                                     if len(response.css('#picG .fr::text').extract()) > 1
                                     else response.css('.page_c+ .page_c::text').extract()[1].strip() + ' 08:00',
                                     'YYYY年MM月DD日HH:mm ZZ').isoformat()
            item["crawledDate"] = datetime.utcnow().isoformat()
            item["origin_name"] = self.origin['name']
            item["origin_key"] = self.origin['key']
        else:
            # 普通模版，如 http://hb.people.com.cn/n2/2017/0414/c337099-30031538.html
            item["_id"] = ObjectId()
            item["title"] = response.css('h1::text').extract_first()
            item["subTitle"] = ''
            item["category"] = response.css('.clink:last-child::text').extract_first()
            item["keywords"] = ''
            item["url"] = response.url
            item["content"] = re.sub(r"/(NMediaFile/.+\.jpg)", response.urljoin(r"../../../\1"),
                                     ''.join(response.css('.box_con p').extract()))
            item["articleSource"] = response.css('.box01 .fl a::text').extract_first()
            item["authorName"] = response.css('.author::text').extract_first()
            item["editorName"] = response.css('.edit::text').extract_first()
            item["date"] = arrow.get(response.css('.box01 .fl::text').extract_first()[:-5] + ' 08:00',
                                     'YYYY年MM月DD日HH:mm ZZ').isoformat()
            item["crawledDate"] = datetime.utcnow().isoformat()
            item["origin_name"] = self.origin['name']
            item["origin_key"] = self.origin['key']

        return item

    def process_next_page_links(self, links):
        for link in links:
            if link.text == '下一页':
                return links
            else:
                return []
