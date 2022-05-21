# coding: utf-8

import os
import sqlite3

from academis.content import MarkdownContentRepository

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
    slug VARCHAR(200),
    data TEXT
)
"""


def initialize(db):
    db.executescript(SQL_CREATE)


def clear(db):
    db.executescript("DELETE FROM article")
    db.executescript("DELETE FROM file")


def insert_article(db, tag, slug, a):
    query = "INSERT INTO article VALUES (?,?,?,?)"
    db.execute(query, (tag, slug, a.title, a.text))


def insert_file(db, tag, slug, data):
    """saves a file (image, zip) attached to an article to the DB"""
    query = "INSERT INTO file VALUES (?,?,?)"
    db.execute(query, (tag, slug, data))


def save_article(db, tag, slug, article):
    """saves an article and all files inside to DB"""
    insert_article(db, tag, slug, article)
    for slug, data in article.files:
        insert_file(db, tag, slug, data)


def load_all_articles(db, verbose=False):
    """loads entire content into the database"""
    n = 0
    repo = MarkdownContentRepository()
    for tag, slug, article in repo.get_all_articles(verbose):
        save_article(db, tag, slug, article)
        n += 1
    return n


if __name__ == "__main__":
    db = sqlite3.connect(DB_PATH)

    with db:
        initialize(db)
        clear(db)
        n = load_all_articles(db, verbose=True)
        print(f"\n{n} articles added")
