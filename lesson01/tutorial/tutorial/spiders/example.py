# -*- coding: utf-8 -*-

'''
Scrapy Tutoria
create a scrapy project
https://doc.scrapy.org/en/latest/intro/tutorial.html
'''
import scrapy


class ExampleSpider(scrapy.Spider):
    name = "example"
    allowed_domains = ["example.com"]
    start_urls = ['http://example.com/']

    def parse(self, response):
        pass
