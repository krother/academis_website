# coding: utf-8

import base64

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from academis.content import MarkdownContentRepository
from academis.db_model import connection_string, Article, StoredFile, Base


def initialize(db):
    db.execute("DROP TABLE IF EXISTS article")
    db.execute("DROP TABLE IF EXISTS file")
    Base.metadata.create_all(db)


def clear(db):
    db.execute("DELETE FROM article")
    db.execute("DELETE FROM file")


def save_article(db, tag, slug, article):
    """saves an article and all files inside to DB"""
    insert_article(db, tag, slug, article)
    for slug, data in article.files:
        insert_file(db, tag, slug, data)


def load_all_articles(db, verbose=False):
    """loads entire content into the database"""
    articles = []
    files = []
    with Session(db) as session:
        repo = MarkdownContentRepository()
        for tag, slug, article in repo.get_all_articles(verbose):
            articles.append(Article(
                    tag=tag,
                    slug=slug,
                    title=article.title,
                    text=article.text
                ))
            for slug, data in article.files:
                #data_b64 = base64.b64encode(data)
                files.append(StoredFile(
                    tag=tag,
                    slug=slug,
                    data=data
                ))

        session.add_all(articles)
        session.add_all(files)
        session.commit()

    return len(articles)


if __name__ == "__main__":
    db = create_engine(connection_string)

    initialize(db)
    clear(db)
    n = load_all_articles(db, verbose=True)
    print(f"\n{n} articles added")
