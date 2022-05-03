# coding: utf-8

import sqlite3
from academis.content import (
    MarkdownContentRepository,
)
import os


DB_PATH = os.path.join(os.path.split(__file__)[0], "../academis.sqlite3")

SQL_CREATE = """
CREATE TABLE IF NOT EXISTS article (
    tag VARCHAR(100),
    slug VARCHAR(100),
    title VARCHAR(100),
    text TEXT
);

CREATE TABLE IF NOT EXISTS file (
    tag VARCHAR(100),
    name VARCHAR(200),
    data TEXT
)
"""

def initialize(db):
    db.executescript(SQL_CREATE)


def clear(db):
    db.executescript("DELETE FROM article")


def insert_article(db, tag, slug, a):
    query = "INSERT INTO article VALUES (?,?,?,?)"
    db.execute(query, (tag, slug, a.title, a.text))


def insert_file(db, tag, filedata):
    """saves a file (image, zip) attached to an article to the DB"""
    slug, data = filedata
    query = "INSERT INTO file VALUES (?,?,?)"
    db.execute(query, (tag, slug, data))


def save_article(db, tag, article):
    """saves an article and all files inside to DB"""
    insert_article(db, tag, slug, article)
    for filedata in article.files:
        insert_file(db, tag, filedata)


def get_all_articles():
    repo = MarkdownContentRepository()
    for tag in repo.get_all_tags():
        print(f"\nprocessing {tag}")

        # insert TOC article
        a = repo.get_article_list_html(tag)
        yield tag, None, a

        # normal posts
        for slug in repo.get_all_article_slugs(tag):
            print(".", end="")
            a = repo.get_article_html(tag, slug)
            yield tag, slug, a


def load_all_articles(db):
    """loads entire content into the database"""
    n = 0
    for tag, slug, article in get_all_articles():
        save_article(db, tag, slug, article)
        n += 1
    return n


if __name__ == "__main__":
    db = sqlite3.connect(DB_PATH)

    with db:
        initialize(db)
        clear(db)
        n = load_all_articles(db)
        print(f"\n{n} articles added")
