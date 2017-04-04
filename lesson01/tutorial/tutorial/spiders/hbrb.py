# -*- coding: utf-8 -*-

# 打印【湖北日报】某页新闻列表标题

import scrapy


class HbrbSpider(scrapy.Spider):
    name = "hbrb"
    start_urls = ['http://hbrb.cnhubei.com/HTML/hbrb/20170404/index.html']

    def parse(self, response):
        for listItem in response.css('td+ td td td .info2 , td+ td td td .info1'):
            text = listItem.css('a::text').extract_first()
            if text is not None:
                print(text)
