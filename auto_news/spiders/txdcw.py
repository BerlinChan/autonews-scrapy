# -*- coding: utf-8 -*-
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from auto_news.items import NewsDetailItem
from bson.objectid import ObjectId
import arrow
from datetime import datetime
import re


class TxdcwSpider(CrawlSpider):
    """
        腾讯大楚网 - 地市站，包括:
        湖北要闻/宜昌/襄阳/黄石/十堰/孝感/荆门/荆州/黄冈/恩施/随州/潜江/仙桃
        
        大楚-要闻列表     http://hb.qq.com/l/news/list20130625101341.htm
        宜昌-新闻列表     http://hb.qq.com/l/yc/list20130619124315.htm
        襄阳-新闻列表     http://hb.qq.com/l/xy/list20130619124740.htm
        黄石-新闻列表     http://hb.qq.com/l/hs/list20151231151356.htm
        孝感-新闻列表     http://hb.qq.com/l/dachuxiaogan/list201605493502.htm
        潜江-新闻列表     http://hb.qq.com/l/qj/list20161223113121.htm
        随州-新闻列表     http://hb.qq.com/l/sz/suizhounews.htm
        恩施-新闻列表     http://hb.qq.com/l/es/esyw/list20151230161913.htm
        黄冈-新闻列表     http://hb.qq.com/l/hg/list20151231151003.htm
        荆门-新闻列表     http://hb.qq.com/l/jm/jmyw/jmtt/list2015015104550.htm
        荆州-新闻列表     http://hb.qq.com/l/jz/jzyw/jzywlist.htm  
        仙桃-新闻列表     http://hb.qq.com/l/xt/xtyw/list20160127112918.htm   
        十堰-新闻列表     http://hb.qq.com/l/sy/synews/shiyan-news-list.htm  
    """
    name = "txdcw"
    allowed_domains = ["hb.qq.com"]
    start_urls = [
        'http://hb.qq.com/l/news/list20130625101341.htm',  # 大楚-要闻列表
        'http://hb.qq.com/l/yc/list20130619124315.htm',  # 宜昌-新闻列表
        'http://hb.qq.com/l/xy/list20130619124740.htm',  # 襄阳-新闻列表
        'http://hb.qq.com/l/hs/list20151231151356.htm',  # 黄石-新闻列表
        'http://hb.qq.com/l/dachuxiaogan/list201605493502.htm',  # 孝感-新闻列表
        'http://hb.qq.com/l/qj/list20161223113121.htm',  # 潜江-新闻列表
        'http://hb.qq.com/l/sz/suizhounews.htm',  # 随州-新闻列表
        'http://hb.qq.com/l/es/esyw/list20151230161913.htm',  # 恩施-新闻列表
        'http://hb.qq.com/l/hg/list20151231151003.htm',  # 黄冈-新闻列表
        'http://hb.qq.com/l/jm/jmyw/jmtt/list2015015104550.htm',  # 荆门-新闻列表
        'http://hb.qq.com/l/jz/jzyw/jzywlist.htm',  # 荆州-新闻列表
        'http://hb.qq.com/l/xt/xtyw/list20160127112918.htm',  # 仙桃-新闻列表
        # 'http://hb.qq.com/l/sy/synews/shiyan-news-list.htm',  # 十堰-新闻列表
    ]
    rules = [
        Rule(LinkExtractor(allow='\d{8}/\d{6}\.htm$',
                           restrict_css='.newslist li'),
             callback='parse_detail_item'),
        Rule(LinkExtractor(allow='.+\.htm$',
                           restrict_css='.newslist+ .pageNav a:last-child'),
             process_links='process_next_page_links', follow=True),
    ]
    custom_settings = {
        'CONCURRENT_REQUESTS': 5,
        'DOWNLOAD_DELAY': 1,  # 间隔时间
        'SPIDER_MIDDLEWARES': {
            'auto_news.middlewares.EmptyCookiesMiddleware': 500,
            'auto_news.middlewares.StartJVMMiddleware': 600,
        },
        'ITEM_PIPELINES': {
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
        item["title"] = response.css('#Table17 tr:nth-child(1) td::text').extract_first()
        item["subTitle"] = ''.join(
            response.css('#Table17 tr:nth-child(2) td::text,'
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
        item["origin_key"] = 'txdcw'
        item["origin_name"] = '腾讯大楚网'

        return item

    def process_next_page_links(self, links):
        for link in links:
            if link.text == '下一页>':
                return links
            else:
                return []
