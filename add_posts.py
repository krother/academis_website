# coding: utf-8

import sqlite3
from dbhelper import DB_PATH
from settings import CONTENT_PATH, POST_PATH, TALK_PATH, COURSE_PATH
import markdown
import os
import re
from collections import namedtuple


Article = namedtuple('Article', ['filename', 'title', 'published', 'timestamp', 'tags', 'language', 'license'])


def slugify(s):
    s = os.path.split(s)[-1]
    s = s.strip().lower()
    s = s.replace('.md', '')
    s = s.replace('.html', '')
    s = s.replace(' ', '_')
    return s


def wrap_images(content):
    """Add extra div tag to content"""
    content = re.sub(r'(\<img [^\>]+\>)', r'<div class="media">\1</div>', content)
    content = re.sub(r'\<img ([^\>]+\>)', r'<img class="media-object" \1', content)
    return content


def read_content(fn):
    content = open(fn).read()
    if fn.endswith('.md'):
        content = markdown.markdown(content, extensions=[
            'markdown.extensions.tables',
            'markdown.extensions.codehilite'])
        content = wrap_images(content)
    if fn.endswith('.html'):
        mdfn = fn.replace('.html', '.md')
        if os.path.exists(mdfn):
            return 0
    return content


def add_article(db, article, path, tablename):
    fn = os.path.join(path, article.filename)
    slug = slugify(article.filename)
    content = read_content(fn)
    content = re.sub('.+\<\/h1\>', '', content)
    query = 'INSERT INTO {} VALUES (?,?,?,?,?)'.format(tablename)
    db.execute(query, (article.title, slug, article.tags, content, article.published))
    return 1


def add_post(db, article):
    fn = os.path.join(POST_PATH, article.filename)
    slug = slugify(article.filename)
    content = read_content(fn)
    query = 'INSERT INTO posts VALUES (?,?,?,?,?,?,?)'
    db.execute(query, (slug, article.title, content, article.published, article.timestamp, article.language, article.license))
    return 1


def add_tag(db, tag, post):
    slug = slugify(tag)
    query = 'INSERT INTO tags VALUES (?,?,?)'
    db.execute(query, (slug, tag, post))
    return 1


def parse_article_list(fn):
    for line in open(fn):
        col = line.strip().split('\t')
        if len(col) == 7:
            yield Article(*col)
        else:
            print('invalid format', col)


if __name__ == '__main__':
    db = sqlite3.connect(DB_PATH)

    with db:
        db.executescript('DELETE FROM posts')
        db.executescript('DELETE FROM tags')
        db.executescript('DELETE FROM talks')
        db.executescript('DELETE FROM courses')

        nposts = 0
        ntags = 0
        for article in parse_article_list(CONTENT_PATH + 'titles.txt'):
            nposts += add_post(db, article)
            if article.published == 'Y':
                post = slugify(article.filename)
                for t in article.tags.split(','):
                    ntags += add_tag(db, t.strip(), post)

        print('posts added: %i' % nposts)
        print('tag entries added: %i' % ntags)

        # talks
        ntalks = 0
        for article in parse_article_list(CONTENT_PATH + 'talks.txt'):
            if article.published == 'Y':
                add_article(db, article, TALK_PATH, 'talks')
                ntalks += 1
        print('talks added: {}'.format(ntalks))

        # courses
        ncourses = 0
        for article in parse_article_list(CONTENT_PATH + 'courses.txt'):
            if article.published == 'Y':
                add_article(db, article, COURSE_PATH, 'courses')
                ncourses += 1
        print('courses added: {}'.format(ncourses))
