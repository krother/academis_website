"""
Sibling of content.py

Has the same API but uses DB connection
"""
import sqlite3
from academis.db_loader import DB_PATH
from academis.html_converter import Article
from academis.repository import AbstractContentRepository


class SQLContentRepository(AbstractContentRepository):

    def __init__(self):
        self.db = sqlite3.connect(DB_PATH)

    def get_article_list_html(self, tag):
        cursor = self.db.execute("SELECT title, text FROM article WHERE tag=? AND slug IS NULL", (tag,))
        title, text = next(cursor)
        return Article(title, text, None)


    def get_article_html(self, tag, slug):
        cursor = self.db.execute("SELECT title, text FROM article WHERE tag=? AND slug=?", (tag, slug))
        title, text = next(cursor)
        return Article(title, text, None)


    def get_all_tags(self):
        cursor = self.db.execute("SELECT DISTINCT tag FROM article")
        return [row[0] for row in cursor]


    def get_all_article_slugs(self, tag):
        cursor = self.db.execute("SELECT slug FROM article WHERE tag=?", (tag,))
        return [row[0] for row in cursor]


    def get_all_slugs(self):
        result = []
        for tag in get_all_tags():
            result += [(tag, slug) for slug in get_all_article_slugs(tag)]
        return result


if __name__ == "__main__":
    repo = SQLContentRepository()
    for t, s in repo.get_all_slugs():
        print(t, s)