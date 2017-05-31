# coding: utf-8

import sqlite3
from settings import DB_PATH

DB_SETUP = '''

CREATE TABLE IF NOT EXISTS posts (
    slug VARCHAR(32),
    title VARCHAR(250),
    content TEXT,
    published VARCHAR(1),
    date_published VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS talks (
    title VARCHAR(250),
    tag VARCHAR(32),
    content TEXT,
    published VARCHAR(1)
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
    query = '''SELECT title, slug FROM posts WHERE published="Y" ORDER BY date_published DESC'''
    result = connection.execute(query)
    return reversed(list(result))


def get_all_talks(connection):
    query = '''SELECT title, tag, content FROM talks WHERE published="Y"'''
    result = connection.execute(query)
    return reversed(list(result))


def get_all_tags(connection, min_number, exclude):
    query = '''SELECT tag, slug, count(tag) FROM tags
      GROUP BY tag ORDER BY tag'''
    result = connection.execute(query)
    result = [r for r in result if r[2] >= min_number]
    result = [r for r in result if r[0] not in exclude]
    return [(r[0], r[1]) for r in result]


def get_posts_by_tag(connection, slug):
    query = '''SELECT p.title, p.slug FROM tags t
      INNER JOIN posts p ON t.post_slug=p.slug WHERE t.slug="%s" ORDER BY p.date_published''' % slug
    result = connection.execute(query)
    return reversed(list(result))


def get_tagname(connection, slug):
    query = '''SELECT tag FROM tags WHERE slug="%s"''' % slug
    result = list(connection.execute(query))
    if result:
        return result[0][0].title()
    else:
        return unslugify(slug)


if __name__ == '__main__':
    initialize_database(DB_PATH)
