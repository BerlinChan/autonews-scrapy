from scrapy.dupefilters import RFPDupeFilter
import pymongo


class SeenURLFilter(RFPDupeFilter):
    """A dupe filter that considers the URL"""

    def __init__(self, path=None, *, mongo_uri, mongo_db):
        self.urls_seen = set()
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db
        RFPDupeFilter.__init__(self, path)

    @classmethod
    def from_settings(cls, settings):
        return cls(
            mongo_uri=settings.get('MONGO_URI'),
            mongo_db=settings.get('MONGO_DATABASE')
        )

    def open(self):  # can return deferred
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close(self, reason):  # can return a deferred
        self.client.close()

    def request_seen(self, request):
        if request.url in self.urls_seen:
            return True
        elif self.db['detail'].find_one({'url': request.url}):
            return True
        else:
            self.urls_seen.add(request.url)
