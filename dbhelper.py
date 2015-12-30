# coding: utf-8

import sqlite3
import os
from settings import DB_PATH

DB_SETUP = '''

CREATE TABLE IF NOT EXISTS posts (
    slug VARCHAR(32),
    title VARCHAR(250),
    content TEXT
); 

CREATE TABLE IF NOT EXISTS tags (
    slug VARCHAR(32),
    tag VARCHAR(32),
    post_slug VARCHAR(32)
);

CREATE UNIQUE INDEX i1 ON posts(slug);

'''

def unslugify(slug):
    slug = slug.replace('_', ' ')
    slug = slug.replace('-', ' ')
    slug = slug.title()
    return slug

def initialize_database(path):
    print('creating SQL database from scratch')
    db = sqlite3.connect(path)
    db.executescript(DB_SETUP)
    db.close()

def get_post(connection, slug):
    query = '''SELECT title, content FROM posts WHERE slug="%s"''' % slug
    result = list(connection.execute(query))
    if result:
        title, content = result[0]
        return title, content
    else:
        return 'Empty blog post', ''

def get_all_posts(connection):
    query = '''SELECT title, slug FROM posts'''
    result = connection.execute(query)
    return list(result)

def get_all_tags(connection):
    query = '''SELECT tag, slug FROM tags GROUP BY tag ORDER BY tag'''
    result = connection.execute(query)
    return [(r[0], r[1]) for r in result]

def get_posts_by_tag(connection, slug):
    query = '''SELECT p.title, p.slug FROM tags t INNER JOIN posts p ON t.post_slug=p.slug WHERE t.slug="%s"''' % slug
    result = connection.execute(query)
    return list(result)

def get_tagname(connection, slug):
    query = '''SELECT tag FROM tags WHERE slug="%s"''' % slug
    result = list(connection.execute(query))
    if result:
        return result[0][0].title()
    else:
        return unslugify(slug)


if __name__ == '__main__':
    initialize_database(DB_PATH)
