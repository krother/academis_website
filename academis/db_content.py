"""
Sibling of content.py

Has the same API but uses DB connection
"""
import base64

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from academis.db_model import connection_string, Article, StoredFile
from academis.html_converter import Article as ArticleObj
from academis.repository import AbstractContentRepository


class SQLContentRepository(AbstractContentRepository):

    def __init__(self):
        self.db = create_engine(connection_string)

    def get_article_list_html(self, tag):
        with Session(self.db) as session:
            stmt = select(Article).where(
                Article.tag==tag,
                Article.slug==None
                )
            for article in session.scalars(stmt):
                return ArticleObj(article.title, article.text, None, None)

    def get_article_html(self, tag, slug):
        with Session(self.db) as session:
            stmt = select(Article).where(
                Article.tag==tag,
                Article.slug==slug
                )
            for article in session.scalars(stmt):
                return ArticleObj(article.title, article.text, None, None)

    def get_all_tags(self):
        db = create_engine(connection_string)
        cursor = db.execute("SELECT DISTINCT tag FROM article")
        return [row[0] for row in cursor]

    def get_all_article_slugs(self, tag):
        db = create_engine(connection_string)
        cursor = db.execute(
            "SELECT slug FROM article WHERE tag=? AND slug NOT NULL", (tag,)
            )
        return [row[0] for row in cursor]

    def get_all_slugs(self):
        result = []
        for tag in self.get_all_tags():
            result += [
                (tag, slug)
                for slug in self.get_all_article_slugs(tag)
                ]
        return result

    def get_file(self, tag, slug):
        with Session(self.db) as session:
            stmt = select(StoredFile).where(
                StoredFile.tag==tag,
                StoredFile.slug==slug
                )
            for file_entry in session.scalars(stmt):
                return base64.b64decode(file_entry.data)


if __name__ == "__main__":
    repo = SQLContentRepository()
    for t, s in repo.get_all_slugs():
        print(t, s)
