"""
Sibling of content.py

Has the same API but uses DB connection
"""
import sqlite3
from academis.db_loader import DB_PATH
from academis.html_converter import Article

#TODO: refactor with content.py

db = sqlite3.connect(DB_PATH)


def get_article_list_html(tag):
    cursor = db.execute("SELECT title, text FROM article WHERE tag=? AND slug IS NULL", (tag,))
    title, text = next(cursor)
    return Article(title, text, None)


def get_article_html(tag, slug):
    cursor = db.execute("SELECT title, text FROM article WHERE tag=? AND slug=?", (tag, slug))
    title, text = next(cursor)
    return Article(title, text, None)


def get_all_tags():
    cursor = db.execute("SELECT DISTINCT tag FROM article")
    return [row[0] for row in cursor]


def get_all_article_slugs(tag):
    cursor = db.execute("SELECT slug FROM article WHERE tag=?", (tag,))
    return [row[0] for row in cursor]


def get_all_slugs():
    result = []
    for tag in get_all_tags():
        result += [(tag, slug) for slug in get_all_article_slugs(tag)]
    return result


if __name__ == "__main__":
    for t, s in get_all_slugs():
        print(t, s)
