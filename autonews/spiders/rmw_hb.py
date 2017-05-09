# -*- coding: utf-8 -*-
import scrapy
from bson.objectid import ObjectId
from autonews.items import NewsListItem, NewsDetailItem
import arrow


class RmwHbSpider(scrapy.Spider):
    name = "rmw_hb"
    origin = {'key': 'rmw_hb', 'name': '人民网-湖北频道'}
    allowed_domains = ["hb.people.com.cn"]
    start_urls = [
        'http://hb.people.com.cn/GB/337099/index1.html',
        'http://hb.people.com.cn/GB/194146/194147/index.html'
    ]
    custom_settings = {
        'ITEM_PIPELINES': {
            'autonews.pipelines.RemoveDuplicatePipeline': 200,
            'autonews.pipelines.SocketOnNewsAdded': 300,
            'autonews.pipelines.InsertItemPipeline': 400,
        }
    }

    def parse(self, response):
        for listItem in response.css('.d2_2 li'):
            url = response.urljoin(listItem.css('a::attr(href)').extract_first())
            yield NewsListItem(
                _id=str(ObjectId()),
                origin_key=self.origin['key'],
                origin_name=self.origin['name'],
                url=url,
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
                yield scrapy.Request(next_page, callback=self.parse)
