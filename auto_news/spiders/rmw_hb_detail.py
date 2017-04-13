# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from auto_news.items import NewsListItem, NewsDetailItem
from bson.objectid import ObjectId
import arrow
from datetime import datetime


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
            'auto_news.pipelines.InsertItemPipeline': 400,
        }
    }

    def closed(self, reason):
        print('Crawl complete: ' + self.origin['name'])

    def parse_start_url(self, response):
        for listItem in response.css('.d2_2 li'):
            yield NewsListItem(
                _id=str(ObjectId()),
                origin_key=self.origin['key'],
                origin_name=self.origin['name'],
                url=response.urljoin(listItem.css('a::attr(href)').extract_first()),
                title=listItem.css('a::text').extract_first(),
                date=arrow.get(listItem.css('i::text').extract_first()[2:-2] + ' +08:00',
                               'YYYY年MM月DD日 HH:mm ZZ').isoformat(),
            )

        # next page
        last_btn_text = response.css('.d2tu_3 a:last-child::text').extract_first()
        if last_btn_text == "下一页":
            next_page = response.css('.d2tu_3 a:last-child::attr(href)').extract_first()
            if next_page is not None:
                next_page = response.urljoin(next_page)
                yield scrapy.Request(next_page, callback=self.parse_start_url)

    def parse_detail_item(self, response):
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
            origin_name=self.origin['name'],
            origin_key=self.origin['key'],
        )
        return item

    def process_next_page_links(self, links):
        for link in links:
            if link.text == '下一页':
                return links
            else:
                return []
