# 字典与模型下载 https://github.com/hankcs/HanLP
# -*- coding: utf-8 -*-
from jpype import *

startJVM(getDefaultJVMPath(),
         "-Djava.class.path="
         "./hanlp-1.3.2.jar:"
         "./",
         "-Xms1g", "-Xmx1g")  # 启动JVM，Linux需替换分号;为冒号:

HanLP = JClass('com.hankcs.hanlp.HanLP')
# 中文分词
print(HanLP.segment('你好，欢迎在Python中调用HanLP的API'))

testCases = [
    "商品和服务",
    "结婚的和尚未结婚的确实在干扰分词啊",
    "买水果然后来世博园最后去世博会",
    "中国的首都是北京",
    "欢迎新老师生前来就餐",
    "工信处女干事每月经过下属科室都要亲口交代24口交换机等技术性器件的安装工作",
    "随着页游兴起到现在的页游繁盛，依赖于存档进行逻辑判断的设计减少了，但这块也不能完全忽略掉。"]
for sentence in testCases:
    print(HanLP.segment(sentence))

# 命名实体识别
StandardTokenizer = JClass('com.hankcs.hanlp.tokenizer.StandardTokenizer')
print(StandardTokenizer.segment("我在上海林原科技有限公司兼职工作，"
                                "我经常在台川喜宴餐厅吃饭，"
                                "偶尔去开元地中海影城看电影。"))
StandardTokenizer.SEGMENT.enableAllNamedEntityRecognize(True)
print(StandardTokenizer.segment("我在上海林原科技有限公司兼职工作，"
                                "我经常在台川喜宴餐厅吃饭，"
                                "偶尔去开元地中海影城看电影。"))

# 词性标注
NLPTokenizer = JClass('com.hankcs.hanlp.tokenizer.NLPTokenizer')
print(NLPTokenizer.segment('中国科学院计算技术研究所的宗成庆教授正在教授自然语言处理课程'))

# 关键词提取
document = "水利部水资源司司长陈明忠9月29日在国务院新闻办举行的新闻发布会上透露，" \
           "根据刚刚完成了水资源管理制度的考核，有部分省接近了红线的指标，" \
           "有部分省超过红线的指标。对一些超过红线的地方，陈明忠表示，对一些取用水项目进行区域的限批，" \
           "严格地进行水资源论证和取水许可的批准。"
print(HanLP.extractKeyword(document, 2))

# 自动摘要
print(HanLP.extractSummary(document, 3))

shutdownJVM()
