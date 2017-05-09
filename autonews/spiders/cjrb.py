# -*- coding: utf-8 -*-
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from autonews.items import NewsDetailItem
from bson.objectid import ObjectId
import arrow
from datetime import datetime
import re


class CjrbSpider(CrawlSpider):
    """
        长江日报
        http://cjrb.cjn.cn/
        
        武汉晨报
        http://whcb.cjn.cn/
        
        武汉晚报
        http://whwb.cjn.cn/
    """
    name = "cjrb"
    allowed_domains = ["cjn.cn"]
    todayDateStr = arrow.now().format('YYYY-MM/DD')
    start_urls = [
        'http://cjrb.cjn.cn/html/' + todayDateStr + '/node_2.htm',
        'http://whcb.cjn.cn/html/' + todayDateStr + '/node_42.htm',
        'http://whwb.cjn.cn/html/' + todayDateStr + '/node_22.htm',
    ]

    rules = [
        Rule(LinkExtractor(allow='content.+\.htm$', restrict_css='li'),
             callback='parse_detail_item'),
        Rule(LinkExtractor(allow='node.*\.htm$', restrict_css='div .default'),
             follow=True),
    ]
    custom_settings = {
        'CONCURRENT_REQUESTS': 1,
        'DOWNLOAD_DELAY': 1.6,  # 间隔时间
        'ITEM_PIPELINES': {
            # 'autonews.pipelines.DropEmptyDetailItemPipeline': 100,
            'autonews.pipelines.RemoveDuplicatePipeline': 200,
            'autonews.pipelines.SocketOnNewsAdded': 300,
            'autonews.pipelines.NLPKeywordPipeline': 350,
            'autonews.pipelines.NLPClassifyPipeline': 360,
            'autonews.pipelines.NLPSentimentPipeline': 370,
            'autonews.pipelines.InsertItemPipeline': 400,
        }
    }

    def parse_detail_item(self, response):
        item = NewsDetailItem()
        item["_id"] = ObjectId()
        item["title"] = response.css("table[width='98%'] > tr:nth-child(1) .bt1::text").extract_first()
        item["subTitle"] = response.css("table[width='98%'] > tr:nth-child(1) .bt2::text").extract_first()
        item["category"] = response.css("table[height='30'] td[width='120']::text").extract_first() + \
                           response.css("table[height='30'] .bt3::text").extract_first()
        item["url"] = response.url.lower()

        all_img = response.css("table[width='98%'] > tr:nth-child(4) img").extract()
        all_img = list(
            map(lambda i: re.sub(r"src=\"(.+\.jpg)\"", "src=\"" + response.urljoin(r"\1") + "\"", i),
                all_img))
        item["content"] = ''.join(all_img) + \
                          response.css("table[width='98%'] > tr:nth-child(5) td.xilan_content_tt").extract_first()
        item["articleSource"] = ''
        item["authorName"] = ''
        item["editorName"] = ''
        item["date"] = arrow.get(re.search(r'html/(\d{4}-\d{2}/\d{2})/content', response.url).group(1) + ' 08:00',
                                 'YYYY-MM/DD ZZ').isoformat()
        item["crawledDate"] = datetime.utcnow().isoformat()

        second_level_domain = re.search(r'http://(\w+)\.cjn.cn/', response.url.lower()).group(1)
        if second_level_domain == 'cjrb':
            item["origin_key"] = 'cjrb'
            item["origin_name"] = '长江日报'
        elif second_level_domain == 'whcb':
            item["origin_key"] = 'whcb'
            item["origin_name"] = '武汉晨报'
        elif second_level_domain == 'whwb':
            item["origin_key"] = 'whwb'
            item["origin_name"] = '武汉晚报'

        return item
