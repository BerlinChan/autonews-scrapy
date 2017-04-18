# -*- coding: utf-8 -*-
from jpype import *

startJVM(getDefaultJVMPath(),
         "-Djava.class.path="
         "./lib/THUCTC_java_v1/liblinear-1.8.jar:"
         "./lib/THUCTC_java_v1/THULAC_java_v1.jar:"
         "./lib/THUCTC_java_v1/",
         "-Xms1g", "-Xmx1g")  # 启动JVM，Linux需替换分号;为冒号:
BasicTextClassifier = JClass('org.thunlp.text.classifiers.BasicTextClassifier')
ClassifyResult = JClass('org.thunlp.text.classifiers.ClassifyResult')
LinearBigramChineseTextClassifier = JClass('org.thunlp.text.classifiers.LinearBigramChineseTextClassifier')

# 新建分类器对象
classifier = BasicTextClassifier()

# 设置分类种类，并读取模型
defaultArguments = "-l ./lib/THUCTC_java_v1/news_model/"
classifier.Init(defaultArguments.split(" "))
classifier.runAsBigramChineseTextClassifier()

# 之后就可以使用分类器进行分类
text = "再次回到世锦赛的赛场上，林丹终于变回了以前的那个超级丹."
topN = 3  # 保留最有可能的3个结果
result = classifier.classifyText(text, topN)
print(result)
for i in range(topN):
    # 输出分类编号，分类名称，以及概率值。
    print(result[i].label,
          classifier.getCategoryName(result[i].label),
          result[i].prob)

shutdownJVM()
