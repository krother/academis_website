import os

from sqlalchemy import Column, Integer, String, Text, BLOB
from sqlalchemy.orm import declarative_base


CONNECTION_CONFIG = os.path.join(os.path.split(__file__)[0], '../sql_connection.txt')
connection_string = open(CONNECTION_CONFIG).read().strip()

Base = declarative_base()


class Article(Base):
    __tablename__ = "article"

    article_id = Column(Integer, primary_key=True)
    tag = Column(String(100))
    slug = Column(String(100))
    title = Column(String(100))
    text = Column(Text())


class StoredFile(Base):
    __tablename__ = "file"

    file_id = Column(Integer, primary_key=True)
    tag = Column(String(100))
    slug = Column(String(200))
    data = Column(BLOB())
