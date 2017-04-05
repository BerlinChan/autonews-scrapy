# -*- coding: utf-8 -*-

# 打印【大楚宜昌】新闻列表所有分页中新闻标题

import scrapy


class TxdcwYcSpider(scrapy.Spider):
    name = "txdcw_yc"
    allowed_domains = ["hb.qq.com"]
    start_urls = ['http://hb.qq.com/l/yc/list20130619124315.htm']
    custom_settings = {
        'CONCURRENT_ITEMS': 1,
        'CONCURRENT_REQUESTS': 1,
    }

    def parse(self, response):
        for listItem in response.css('.newslist li'):
            print(listItem.css('a::text').extract_first())

        next_page = response.css('.newslist+ .pageNav a+ .f12::attr(href)').extract_first()
        if next_page is not None:
            yield scrapy.Request(next_page, self.parse)
