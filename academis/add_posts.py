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
CREATE TABLE IF NOT EXISTS articles (
    tag VARCHAR(100),
    slug VARCHAR(100),
    title VARCHAR(100),
    text TEXT
);
"""


def insert_article(tag, slug, a):
    query = "INSERT INTO articles VALUES (?,?,?,?)"
    db.execute(query, (tag, slug, a.title, a.text))


if __name__ == "__main__":
    db = sqlite3.connect(DB_PATH)

    with db:
        db.executescript(SQL_CREATE)
        db.executescript("DELETE FROM articles")

        n = 0
        for tag in get_all_tags():
            print(f"\nprocessing {tag}")
            a = get_article_list_html(tag)
            insert_article(tag, None, a)
            n += 1
            for slug in get_all_article_slugs(tag):
                print(".", end="")
                a = get_article_html(tag, slug)
                insert_article(tag, slug, a)
                n += 1

        print(f"{n} articles added")
