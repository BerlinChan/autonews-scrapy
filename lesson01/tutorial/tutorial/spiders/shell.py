'''
interactive shell tutorial
https://doc.scrapy.org/en/latest/topics/shell.html#topics-shell
'''

import scrapy


class MySpider(scrapy.Spider):
    name = "scrapyShell"
    start_urls = [
        "http://example.com",
        "http://example.org",
        "http://example.net",
    ]

    def parse(self, response):
        # We want to inspect one specific response.
        if ".org" in response.url:
            from scrapy.shell import inspect_response
            inspect_response(response, self)

            # Rest of parsing code.
