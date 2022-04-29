# coding: utf-8

import sqlite3
from academis.content import (
    get_all_tags,
    get_all_article_slugs,
    get_article_list_html,
    get_article_html,
    BASE_PATH,
)


DB_PATH = BASE_PATH + "../academis.sqlite3"

SQL_CREATE = """
CREATE TABLE IF NOT EXISTS article (
    tag VARCHAR(100),
    slug VARCHAR(100),
    title VARCHAR(100),
    text TEXT
);
"""

def initialize(db):
    db.executescript(SQL_CREATE)


def clear(db):
    db.executescript("DELETE FROM article")


def insert_article(db, tag, slug, a):
    query = "INSERT INTO article VALUES (?,?,?,?)"
    db.execute(query, (tag, slug, a.title, a.text))


def load_all_articles(db):
    n = 0
    for tag in get_all_tags():
        print(f"\nprocessing {tag}")
        a = get_article_list_html(tag)
        insert_article(db, tag, None, a)
        n += 1
        for slug in get_all_article_slugs(tag):
            print(".", end="")
            a = get_article_html(tag, slug)
            insert_article(db, tag, slug, a)
            n += 1
    return n


if __name__ == "__main__":
    db = sqlite3.connect(DB_PATH)

    with db:
        initialize(db)
        clear(db)
        n = load_all_articles(db)
        print(f"\n{n} articles added")
